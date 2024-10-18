import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import Role, { ROLE } from '../roles/entities/role.entity';
import { Repository } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {
  constructor(private readonly rolesService: RolesService) {}

  async onModuleInit() {
    const adminRole = {
      name: ROLE.ADMIN,
      description: ROLE.ADMIN,
    };

    const salesRole = {
      name: ROLE.SALES,
      description: ROLE.SALES,
    };

    this.rolesService.createRole(adminRole);

    this.rolesService.createRole(salesRole);
  }
}
