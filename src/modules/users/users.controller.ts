import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ConflictException,
  Query,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CustomResponseType } from 'src/utils/types/definitions';
import { PaginationDto } from '../pagination/pagination.dto';
import { USER_NOT_FOUND } from '../../utils/constants/messageConstants';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { Roles } from '../../decorators/roles.decorator';
import { ROLE } from '../roles/entities/role.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@Roles(ROLE.ADMIN)
@UseGuards(RolesGuard)
@UseGuards(JwtAccessTokenGuard)
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Admin creates new user',
    description: `
    * Only Admin can use this API
    `,
  })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      user_1: {
        value: {
          email: 'Test1@gmail.com',
          password: 'Test1@gmail.com',
          name: 'Test1@gmail.com',
          genderId: 1,
          phoneNumber: '0123456789',
          address: 'new address',
          companyId: 2,
          roleId: 1,
        } as CreateUserDto,
      },
      user_2: {
        value: {
          email: 'Test2@gmail.com',
          password: 'Test2@gmail.com',
          name: 'Test2@gmail.com',
          genderId: 1,
          phoneNumber: '0123456789',
          address: 'new address',
          companyId: 2,
          roleId: 1,
        } as CreateUserDto,
      },
    },
  })
  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CustomResponseType> {
    const result = await this.usersService.createUser(createUserDto);

    if (!result) {
      throw new ConflictException('Email này đã tồn tại', {
        cause: new Error('Create user service return null'),
        description: 'Conflict',
      });
    }

    const res: CustomResponseType = {
      message: 'Đã tạo người dùng mới',
      result,
    };

    return res;
  }

  @ApiOperation({
    summary: 'Admin get all users',
    description: `
    * Only Admin can use this API
    `,
  })
  @Get()
  async getAllUsers(
    @Query() paginationDto: PaginationDto,
  ): Promise<CustomResponseType> {
    const { current, total } = paginationDto;
    const result = await this.usersService.getAllUsers(current, total);

    const res: CustomResponseType = {
      message: 'Tìm tất cả người dùng',
      result,
    };

    return res;
  }

  @ApiOperation({
    summary: 'Admin get specific user by id',
    description: `
    * Only Admin can use this API
    `,
  })
  @ApiParam({
    name: 'id',
    type: String,
    examples: {
      id_1: {
        value: 'fe7f1e20-a72c-4c0f-b21c-f94ddab30030',
        description: 'User not existed',
      },
      id_2: {
        value: '55a4a506-b6e7-4eb1-b062-47b1f955b1eb',
        description: 'User Test 1',
      },
    },
  })
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<CustomResponseType> {
    const result = await this.usersService.getUserById(id, false);

    if (!result) {
      throw new NotFoundException(USER_NOT_FOUND, {
        cause: new Error('Get user service by id return null'),
        description: 'Not found',
      });
    }

    const res: CustomResponseType = {
      message: 'Đã tìm thấy người dùng',
      result,
    };

    return res;
  }

  @ApiOperation({
    summary: 'Admin update user information',
    description: `
    * Only Admin can use this API
    `,
  })
  @ApiParam({
    name: 'id',
    type: String,
    examples: {
      id_1: {
        value: 'fe7f1e20-a72c-4c0f-b21c-f94ddab30030',
        description: 'User not existed',
      },
      id_2: {
        value: '55a4a506-b6e7-4eb1-b062-47b1f955b1eb',
        description: 'User Test 1',
      },
    },
  })
  @ApiBody({
    type: UpdateUserDto,
    examples: {
      user: {
        value: {
          name: 'Test1@gmail.com',
          genderId: 1,
          phoneNumber: '0123456789',
          address: 'new address',
          companyId: 2,
          roleId: 1,
        } as UpdateUserDto,
      },
    },
  })
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<CustomResponseType> {
    const result = await this.usersService.updateUser(id, updateUserDto);

    if (!result) {
      throw new NotFoundException(USER_NOT_FOUND, {
        cause: new Error('Update user service return null'),
        description: 'Not found',
      });
    }

    const res: CustomResponseType = {
      message: 'Đã cập nhật thông tin người dùng',
      result,
    };

    return res;
  }

  @ApiOperation({
    summary: 'Admin delete user permanently (*USE WITH CAUTION)',
    description: `
    * Only Admin can use this API
    * CAUTION: this API will delete user permanently, use it carefully
    `,
  })
  @ApiParam({
    name: 'id',
    type: String,
    examples: {
      id_1: {
        value: 'fe7f1e20-a72c-4c0f-b21c-f94ddab30030',
        description: 'User not existed',
      },
      id_2: {
        value: '55a4a506-b6e7-4eb1-b062-47b1f955b1eb',
        description: 'User Test 1',
      },
    },
  })
  @Delete(':id')
  async deleteUserPermanently(
    @Param('id') id: string,
  ): Promise<CustomResponseType> {
    const result = await this.usersService.deleteUserPermanently(id);

    if (!result) {
      throw new NotFoundException(USER_NOT_FOUND, {
        cause: new Error('Delete user permanently service return null'),
        description: 'Not found',
      });
    }

    const res: CustomResponseType = {
      message: 'Đã xóa người dùng',
      result,
    };

    return res;
  }
}
