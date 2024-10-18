import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from '../roles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import Role, { ROLE } from '../entities/role.entity';

const mockRoleRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  insert: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  findAndCount: jest.fn(),
};

describe('RolesService', () => {
  let rolesService: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: getRepositoryToken(Role),
          useValue: mockRoleRepository,
        },
      ],
    }).compile();

    rolesService = module.get<RolesService>(RolesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(rolesService).toBeDefined();
  });

  it('create role => should return null if role existed', async () => {
    //arrange
    const existedRole: Role = {
      id: 1,
      name: 'bbser',
      description: 'User',
      users: [],
    };
    jest
      .spyOn(mockRoleRepository, 'findOne')
      .mockResolvedValueOnce(existedRole);

    //act
    const result = await rolesService.createRole({
      name: 'User',
      description: 'user',
    });

    //assert
    expect(result).toEqual(null);
  });

  it('create role => should create new role and return its data', async () => {
    //arrange
    const newRole: Role = {
      id: 1,
      name: 'User',
      description: 'User',
      users: [],
    };

    jest.spyOn(mockRoleRepository, 'create').mockReturnValueOnce(newRole);
    jest.spyOn(mockRoleRepository, 'findOne').mockResolvedValueOnce(null);

    //act
    const result = await rolesService.createRole({
      name: 'User',
      description: 'user',
    });

    //assert
    expect(result).toEqual(newRole);
  });
});
