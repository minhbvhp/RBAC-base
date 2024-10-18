import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  afterUpdateUserStub,
  allUserStub,
  createUserStub,
} from './stubs/user.stub';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UsersService } from '../users.service';
import { ConfigModule } from '@nestjs/config';
import User from '../entities/user.entity';
import Role, { ROLE } from '../../roles/entities/role.entity';
import {
  accountantRoleStub,
  salesRoleStub,
} from '../../roles/test/stubs/role.stub';

const mockUserRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  insert: jest.fn(),
  find: jest.fn(),
  update: jest.fn().mockResolvedValue(afterUpdateUserStub()),
  remove: jest.fn(),
  findAndCount: jest.fn(),
};

const mockRoleRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  insert: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  findAndCount: jest.fn(),
};

const createUserDto = {
  email: 'Test1@gmail.com',
  password: 'Test1@gmail.com',
  name: 'Test1@gmail.com',
  genderId: 1,
  phoneNumber: '0123456789',
  address: '24 Điện Biên Phủ',
  roleId: 2,
  companyId: 2,
} as CreateUserDto;

const notAvailableId = '123abc';

const notExistId = '76131254-32ff-413b-9f94-59e6e590961f';

const updateUserDto = {
  name: 'TestUpdate',
  genderId: 2,
  phoneNumber: '55555',
  address: 'Update address',
  roleId: 3,
  companyId: 1,
} as UpdateUserDto;

describe('UsersService', () => {
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Role),
          useValue: mockRoleRepository,
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('createUser', () => {
    it('should return null if user with email already exists', async () => {
      //arrange
      jest
        .spyOn(mockUserRepository, 'findOne')
        .mockResolvedValueOnce(createUserStub());

      //act
      const result = await userService.createUser(createUserDto);

      //assert
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: {
          email: createUserDto.email,
        },
      });

      expect(result).toEqual(null);
    });

    it('should create a new user and return its data', async () => {
      // arrange
      jest
        .spyOn(mockUserRepository, 'create')
        .mockReturnValueOnce(createUserStub());

      jest.spyOn(mockUserRepository, 'findOne').mockResolvedValueOnce(null);

      jest
        .spyOn(mockRoleRepository, 'findOne')
        .mockResolvedValueOnce(salesRoleStub());

      const newUser = createUserStub();

      // act
      const result = await userService.createUser(createUserDto);

      // assert
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: expect.anything(),
        role: salesRoleStub(),
      });

      expect(mockUserRepository.insert).toHaveBeenCalledWith(createUserStub());

      expect(result).toEqual({ userId: newUser.id });
    });
  });

  describe('getAllUsers', () => {
    it('hould return all paginated users', async () => {
      //arrange
      const current = 3;
      const total = 10;

      jest
        .spyOn(mockUserRepository, 'findAndCount')
        .mockResolvedValueOnce([
          allUserStub().slice((current - 1) * total, current * total),
          allUserStub().length,
        ]);

      const skip = (current - 1) * total;
      const totalPages = Math.ceil(allUserStub().length / total);

      //act
      const result = await userService.getAllUsers(current, total);

      //assert
      expect(mockUserRepository.findAndCount).toHaveBeenCalledWith({
        take: total,
        skip,
        relations: expect.anything(),
      });

      expect(result).toEqual({
        users: allUserStub().slice((current - 1) * total, current * total),
        totalPages,
      });
    });
  });

  describe('getUserByEmail', () => {
    it('should return null if user not existed', async () => {
      //arrange
      jest.spyOn(mockUserRepository, 'findOne').mockResolvedValueOnce(null);
      const mockEmail = 'Test@gmail.com';

      //act
      const result = await userService.getUserByEmail(mockEmail);

      //assert
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: mockEmail },
        select: { id: true, email: true, name: true, password: true },
        relations: expect.anything(),
      });

      expect(result).toEqual(null);
    });

    it('should return existed email', async () => {
      //arrange
      const mockEmail = createUserStub().email;
      jest
        .spyOn(mockUserRepository, 'findOne')
        .mockResolvedValueOnce(createUserStub());

      //act
      const result = await userService.getUserByEmail(mockEmail);

      //assert
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: mockEmail },
        select: { id: true, email: true, name: true, password: true },
        relations: expect.anything(),
      });

      expect(result).toEqual(createUserStub());
    });
  });

  describe('updateUser', () => {
    it('should return null if id is not UUID', async () => {
      //arrange

      //act
      const result = await userService.updateUser(
        notAvailableId,
        updateUserDto,
      );

      //assert
      expect(result).toEqual(null);
    });

    it('should return null if user does not exist', async () => {
      //arrange
      jest.spyOn(mockUserRepository, 'findOne').mockResolvedValueOnce(null);

      //act
      const result = await userService.updateUser(notExistId, updateUserDto);

      //assert
      expect(result).toEqual(null);
    });

    it('should update user and return formatted user response', async () => {
      //arrange
      jest
        .spyOn(mockUserRepository, 'findOne')
        .mockResolvedValueOnce(createUserStub());

      jest
        .spyOn(mockRoleRepository, 'findOne')
        .mockResolvedValueOnce(accountantRoleStub());

      jest
        .spyOn(mockUserRepository, 'create')
        .mockReturnValueOnce(afterUpdateUserStub());

      const existId = createUserStub().id;
      const updatedUser = afterUpdateUserStub();

      //act
      const result = await userService.updateUser(existId, updateUserDto);

      //assert

      expect(mockUserRepository.update).toHaveBeenCalledWith(
        existId,
        updatedUser,
      );

      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...updateUserDto,
        role: updatedUser.role,
      });

      expect(result).toEqual(updatedUser);
    });
  });

  describe('deleteUserPermanently', () => {
    it('should return null if id is not UUID', async () => {
      //arrange

      //act
      const result = await userService.deleteUserPermanently(notAvailableId);

      //assert
      expect(result).toEqual(null);
    });

    it('should return null if user does not exist', async () => {
      //arrange
      jest.spyOn(mockUserRepository, 'findOne').mockResolvedValueOnce(null);

      //act
      const result = await userService.deleteUserPermanently(notExistId);

      //assert
      expect(result).toEqual(null);
    });

    it('Shoud delete user and return formatted user response', async () => {
      //arrange
      jest
        .spyOn(mockUserRepository, 'findOne')
        .mockResolvedValueOnce(createUserStub());

      const existId = createUserStub().id;

      const deletedUser = createUserStub();

      //act
      const result = await userService.deleteUserPermanently(existId);

      //assert

      expect(mockUserRepository.remove).toHaveBeenCalledWith(createUserStub());

      expect(result).toEqual(deletedUser);
    });
  });
});
