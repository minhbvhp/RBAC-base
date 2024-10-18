import { Reflector } from '@nestjs/core';
import { JwtAccessTokenGuard } from '../guards/jwt-access-token.guard';
import { Test, TestingModule } from '@nestjs/testing';
import { executionContext } from '../../../shared/test/mocks/execution-context.mock';
import { IS_PUBLIC_KEY } from '../../../decorators/auth.decorator';
import { AuthGuard } from '@nestjs/passport';

describe('JwtAccessTokenGuard', () => {
  let guard: JwtAccessTokenGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAccessTokenGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<JwtAccessTokenGuard>(JwtAccessTokenGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return true when isPublic is true', () => {
    //arrange
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(true);

    //act && assert
    expect(guard.canActivate(executionContext)).toBeTruthy();

    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
      executionContext.getHandler(),
      executionContext.getClass(),
    ]);
  });

  it('should call super.canActivate() when isPublic is false', () => {
    //arrange
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(false);

    jest
      .spyOn(AuthGuard('jwt').prototype, 'canActivate')
      .mockReturnValueOnce(true);

    //act && assert
    expect(guard.canActivate(executionContext)).toBeTruthy();

    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
      executionContext.getHandler(),
      executionContext.getClass(),
    ]);

    expect(AuthGuard('jwt').prototype.canActivate).toHaveBeenCalledTimes(1);
  });
});
