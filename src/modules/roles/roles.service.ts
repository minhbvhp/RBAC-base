import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Role from '../roles/entities/role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
// import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async createRole(createRoleDto: CreateRoleDto) {
    try {
      const existedRole = await this.rolesRepository.findOne({
        where: {
          name: createRoleDto.name,
        },
      });

      if (!existedRole) {
        const newRole = await this.rolesRepository.create(createRoleDto);

        await this.rolesRepository.insert(newRole);

        return newRole;
      }
    } catch (error) {
      throw error;
    }

    return null;
  }

  async getAllRoles(): Promise<Role[]> {
    try {
      const roles = await this.rolesRepository.find();

      return roles;
    } catch (error) {
      throw error;
    }
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} role`;
  // }

  // update(id: number, updateRoleDto: UpdateRoleDto) {
  //   return `This action updates a #${id} role`;
  // }
  // remove(id: number) {
  //   return `This action removes a #${id} role`;
  // }
}
