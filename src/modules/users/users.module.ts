import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import User from 'src/modules/users/entities/user.entity';
import Role from 'src/modules/roles/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role]), ConfigModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
