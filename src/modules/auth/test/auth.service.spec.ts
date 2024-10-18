import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { createUserStub } from '../../users/test/stubs/user.stub';

jest.mock('../../users/users.service');

const loginDto = {
  email: 'NotAvailable@email.com',
  password: '123456',
};

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  // let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService, JwtService, ConfigService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    // jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('getAuthenticatedUser', () => {
    it('throw a BadRequestException if email not existed', async () => {
      //arrange
      jest.spyOn(usersService, 'getUserByEmail').mockResolvedValueOnce(null);
      const { email, password } = loginDto;

      //act && assert
      await expect(
        authService.getAuthenticatedUser(email, password),
      ).rejects.toThrow(BadRequestException);
    });

    it('throw a BadRequestException if email or password wrong', async () => {
      //arrange
      jest
        .spyOn(usersService, 'getUserByEmail')
        .mockResolvedValueOnce(createUserStub());

      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false);

      const { email, password } = loginDto;

      //act && assert
      await expect(
        authService.getAuthenticatedUser(email, password),
      ).rejects.toThrow(BadRequestException);
    });

    it('should return user if email and password matched', async () => {
      //arrange
      jest
        .spyOn(usersService, 'getUserByEmail')
        .mockResolvedValueOnce(createUserStub());

      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => true);

      const { email, password } = createUserStub();

      //act
      const result = await authService.getAuthenticatedUser(email, password);

      //assert
      expect(result).toEqual(createUserStub());
    });
  });

  describe('signIn', () => {
    it('should return access token and refresh token', async () => {
      //arrange
      jest
        .spyOn(authService, 'generateAccessToken')
        .mockImplementationOnce(() => 'access_token');

      jest
        .spyOn(authService, 'generateRefreshToken')
        .mockImplementationOnce(() => 'refresh_token');

      jest
        .spyOn(usersService, 'setCurrentRefreshToken')
        .mockImplementationOnce(() => Promise.resolve());

      jest.spyOn(authService, 'hashToken').mockReturnValueOnce('hashed_token');

      //act
      const result = await authService.signIn(createUserStub());

      //assert
      expect(result).toEqual({
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      });
    });
  });

  describe('getUserIfRefreshTokenMatched', () => {
    it('throw UnauthorizedException if id is not UUID', async () => {
      //arrange

      //act && assert
      await expect(
        authService.getUserIfRefreshTokenMatched('123', 'refresh_token'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throw UnauthorizedException if user not existed', async () => {
      //arrange
      jest.spyOn(usersService, 'getUserById').mockResolvedValueOnce(null);

      //act && assert
      await expect(
        authService.getUserIfRefreshTokenMatched(
          'fc1381bd-09a2-46b8-9ec6-3a9b0b5e1674',
          'refresh_token',
        ),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throw UnauthorizedException if refresh token not match', async () => {
      //arrange
      jest.spyOn(authService, 'verifyHashedToken').mockReturnValueOnce(false);

      //act && assert
      await expect(
        authService.getUserIfRefreshTokenMatched(
          '9c8ffd82-c1df-46f7-b090-0585997485db',
          'refresh_token',
        ),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('return user if user existed and refresh token match', async () => {
      //arrange
      jest.spyOn(authService, 'verifyHashedToken').mockReturnValueOnce(true);

      //act
      const result = await authService.getUserIfRefreshTokenMatched(
        '9c8ffd82-c1df-46f7-b090-0585997485db',
        'refresh_token',
      );

      //act && assert
      expect(result).toEqual(createUserStub());
    });
  });
});
