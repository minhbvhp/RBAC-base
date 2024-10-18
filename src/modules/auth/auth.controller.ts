import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../auth/guards/local.guard';
import { JwtRefreshTokenGuard } from '../auth/guards/jwt-refresh-token.guard';
import { CustomResponseType } from '../../utils/types/definitions';
import { RequestWithUser } from '../../utils/types/request.type';
import { TokenPayload } from './interfaces/token.interface';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @ApiBody({
    type: LoginDto,
    examples: {
      user_1: {
        value: {
          email: 'Test1@gmail.com',
          password: 'Test1@gmail.com',
        } as LoginDto,
      },
      user_2: {
        value: {
          email: 'Admin1@example.com',
          password: 'Admin1@example.com',
        },
      },
    },
  })
  @Post('login')
  async signIn(@Req() request: RequestWithUser): Promise<CustomResponseType> {
    const { user } = request;

    const result = await this.authService.signIn(user);

    const res: CustomResponseType = {
      message: 'Đăng nhập thành công',
      result,
    };
    return res;
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh')
  async refreshAccessToken(@Req() request: RequestWithUser) {
    const { user } = request;

    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
    };

    const access_token = this.authService.generateAccessToken(payload);
    const refresh_token = this.authService.generateRefreshToken(payload);
    this.authService.storeRefreshToken(payload.sub, refresh_token);

    const result = { access_token: access_token, refresh_token: refresh_token };

    const res: CustomResponseType = {
      message: 'Refreshed',
      result,
    };

    return res;
  }
}
