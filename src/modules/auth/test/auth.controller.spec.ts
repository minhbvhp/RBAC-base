import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { mockRequestWithUser } from './mocks/requests.mock';
import { mockAccessToken, mockRefreshToken } from './mocks/tokens.mock';
import { isGuarded } from '../../../shared/test/utils';
import { LocalAuthGuard } from '../guards/local.guard';
import { JwtRefreshTokenGuard } from '../guards/jwt-refresh-token.guard';

jest.mock('../auth.service');

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should be protected with LocalAuthGuard', () => {
      expect(isGuarded(authController.signIn, LocalAuthGuard));
    });

    it('should sign in and return response with tokens', async () => {
      //arrange

      //act
      const response = await authController.signIn(mockRequestWithUser);

      //assert
      expect(response).toEqual({
        message: 'Đăng nhập thành công',
        result: {
          access_token: mockAccessToken,
          refresh_token: mockRefreshToken,
        },
      });
    });
  });

  describe('refreshAccessToken', () => {
    it('should be protected with JwtRefreshTokenGuard', () => {
      expect(
        isGuarded(authController.refreshAccessToken, JwtRefreshTokenGuard),
      );
    });

    it('should refresh token and return response with new tokens', async () => {
      //arrange

      //act
      const response =
        await authController.refreshAccessToken(mockRequestWithUser);

      //assert
      expect(response).toEqual({
        message: 'Refreshed',
        result: {
          access_token: mockAccessToken,
          refresh_token: mockRefreshToken,
        },
      });
    });
  });
});
