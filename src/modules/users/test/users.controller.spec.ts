import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import {
  afterUpdateUserStub,
  allUserStub,
  createUserStub,
} from './stubs/user.stub';
import { CreateUserDto } from '../dto/create-user.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import { isGuarded } from '../../../shared/test/utils';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { JwtAccessTokenGuard } from '../../auth/guards/jwt-access-token.guard';

jest.mock('../users.service');

const createUserDto = {
  email: 'Test1@gmail.com',
  password: 'Test1@gmail.com',
  name: 'Test1@gmail.com',
  genderId: 1,
  phoneNumber: '0123456789',
  address: '24 Điện Biên Phủ',
  roleId: 1,
  companyId: 2,
} as CreateUserDto;

const updateUserDto = {
  name: 'TestUpdate',
  genderId: 2,
  phoneNumber: '55555',
  address: 'Update address',
  roleId: 3,
  companyId: 1,
} as UpdateUserDto;

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  it('should be protected with RolesGuard', () => {
    expect(isGuarded(UsersController, RolesGuard));
  });

  it('should be protected with JwtAccessTokenGuard', () => {
    expect(isGuarded(UsersController, JwtAccessTokenGuard));
  });

  describe('createUser', () => {
    it('should throw ConflictException if user service return null', async () => {
      //arrange
      jest.spyOn(usersService, 'createUser').mockResolvedValueOnce(null);

      //act && assert
      await expect(usersController.createUser(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should create a new user and return response', async () => {
      //arrange

      //act
      const response = await usersController.createUser(createUserDto);

      //expect
      expect(response).toEqual({
        message: 'Đã tạo người dùng mới',
        result: { userId: createUserStub().id },
      });
    });
  });

  describe('getAllUsers', () => {
    it('should return response include paginated users', async () => {
      //arrange

      //act
      const response = await usersController.getAllUsers({
        current: 3,
        total: 10,
      });

      //expect
      expect(response).toEqual({
        message: 'Tìm tất cả người dùng',
        result: allUserStub().slice(20, 30),
      });
    });
  });

  describe('getUserById', () => {
    it('should throw NotFoundException if user service return null', async () => {
      //arrange
      jest.spyOn(usersService, 'getUserById').mockResolvedValueOnce(null);

      //act && assert
      await expect(usersController.getUserById('id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return user if user existed', async () => {
      //arrange

      //act
      const response = await usersController.getUserById('available_id');

      //expect
      expect(response).toEqual({
        message: 'Đã tìm thấy người dùng',
        result: createUserStub(),
      });
    });
  });

  describe('updateUser', () => {
    it('should throw NotFoundException if user service return null', async () => {
      //arrange
      jest.spyOn(usersService, 'updateUser').mockResolvedValueOnce(null);

      //act && assert
      await expect(
        usersController.updateUser('id', updateUserDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update user and return response', async () => {
      //arrange

      //act
      const response = await usersController.updateUser(
        createUserStub().id,
        updateUserDto,
      );

      //act && assert
      expect(usersService.updateUser).toHaveBeenCalledWith(
        createUserStub().id,
        updateUserDto,
      );

      expect(response).toStrictEqual({
        message: 'Đã cập nhật thông tin người dùng',
        result: afterUpdateUserStub(),
      });
    });
  });

  describe('deleteUserPermanently', () => {
    it('should throw NotFoundException if user service return null', async () => {
      //arrange
      jest
        .spyOn(usersService, 'deleteUserPermanently')
        .mockResolvedValueOnce(null);

      //act && assert
      await expect(usersController.deleteUserPermanently('id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should delete user and return response', async () => {
      //arrange

      //act
      const response = await usersController.deleteUserPermanently(
        createUserStub().id,
      );

      //act && assert
      expect(usersService.deleteUserPermanently).toHaveBeenCalledWith(
        createUserStub().id,
      );

      expect(response).toStrictEqual({
        message: 'Đã xóa người dùng',
        result: createUserStub(),
      });
    });
  });
});
