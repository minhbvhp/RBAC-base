import Role, { ROLE } from '../../entities/role.entity';
import User from 'src/modules/users/entities/user.entity';

export const adminRoleStub = (): Role => ({
  id: 1,
  name: ROLE.ADMIN,
  description: 'Admin',
  users: [],
});

export const salesRoleStub = (): Role => ({
  id: 2,
  name: ROLE.SALES,
  description: 'Sales',
  users: [],
});

export const accountantRoleStub = (): Role => ({
  id: 3,
  name: ROLE.ACCOUNTANT,
  description: 'Accountant',
  users: [],
});
