import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import User from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { isUUID } from 'class-validator';
import Role, { ROLE } from '../roles/entities/role.entity';
import {
  ROLE_ID_MUST_NUMBER,
  SERVICE_ERROR_DESCRIPTION,
} from '../../utils/constants/messageConstants';

@Injectable()
export class UsersService {
  private saltRounds: number;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    private readonly configService: ConfigService,
  ) {
    this.saltRounds = this.configService.get('SALT_ROUNDS', 10);
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const existedUser = await this.usersRepository.findOne({
        where: {
          email: createUserDto.email,
        },
      });

      if (!existedUser) {
        let userRole = await this.rolesRepository.findOne({
          where: {
            id: createUserDto.roleId,
          },
        });

        if (!userRole) {
          throw new BadRequestException(
            ROLE_ID_MUST_NUMBER,
            `${SERVICE_ERROR_DESCRIPTION} - create user return null`,
          );
        }

        const hashedPassword = await bcrypt.hash(
          createUserDto.password,
          +this.saltRounds,
        );

        const newUser = await this.usersRepository.create({
          ...createUserDto,
          password: hashedPassword,
          role: userRole,
        });

        await this.usersRepository.insert(newUser);

        return { userId: newUser.id };
      }
    } catch (error) {
      throw error;
    }

    return null;
  }

  async setCurrentRefreshToken(id: string, hashedToken: string): Promise<void> {
    try {
      if (hashedToken) {
        await this.usersRepository.update(id, {
          currentRefreshToken: hashedToken,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers(
    current: number = 1,
    total: number = 10,
  ): Promise<{ users: User[]; totalPages: number }> {
    try {
      const skip = (current - 1) * total;

      const [users, totalItems] = await this.usersRepository.findAndCount({
        take: total,
        skip,
        relations: { role: true },
      });

      const totalPages = Math.ceil(totalItems / total);

      return { users, totalPages };
    } catch (error) {
      throw error;
    }
  }

  async getUserById(
    userId: string,
    isIncludeRefreshToken: boolean = true,
  ): Promise<User> {
    try {
      if (!isUUID(userId)) {
        return null;
      }

      const existedUser = await this.usersRepository.findOne({
        where: {
          id: userId,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          currentRefreshToken: isIncludeRefreshToken,
        },
      });

      if (!existedUser) {
        return null;
      }

      return existedUser;
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      const existedUser = await this.usersRepository.findOne({
        where: {
          email: email,
        },
        select: { id: true, email: true, name: true, password: true },
        relations: {
          role: true,
        },
      });

      return existedUser;
    } catch (error) {
      throw error;
    }
  }

  async getUserWithRole(userId: string): Promise<User> {
    try {
      if (!isUUID(userId)) {
        return null;
      }

      const userWithRole = await this.usersRepository.findOne({
        where: {
          id: userId,
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
        relations: { role: true },
      });

      if (!userWithRole) {
        return null;
      }

      return userWithRole;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      if (!isUUID(id)) {
        return null;
      }

      const existedUser = await this.usersRepository.findOne({
        where: {
          id: id,
        },
      });

      if (existedUser) {
        let userRole = await this.rolesRepository.findOne({
          where: {
            id: updateUserDto.roleId,
          },
        });

        if (!userRole) {
          throw new BadRequestException(
            ROLE_ID_MUST_NUMBER,
            `${SERVICE_ERROR_DESCRIPTION} - create user return null`,
          );
        }

        const updatedUser = await this.usersRepository.create({
          ...updateUserDto,
          role: userRole,
        });

        await this.usersRepository.update(existedUser.id, updatedUser);

        return updatedUser;
      }
    } catch (error) {
      throw error;
    }

    return null;
  }

  async deleteUserPermanently(id: string) {
    try {
      if (!isUUID(id)) {
        return null;
      }

      const existedUser = await this.usersRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!existedUser) {
        return null;
      }

      await this.usersRepository.remove(existedUser);

      return existedUser;
    } catch (error) {
      throw error;
    }
  }
}
