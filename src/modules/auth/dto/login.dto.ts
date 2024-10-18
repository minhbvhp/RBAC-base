import { IsEmail, IsNotEmpty } from 'class-validator';
import {
  EMAIL_MUST_NOT_EMPTY,
  EMAIL_MUST_VALID,
  PASSWORD_MUST_NOT_EMPTY,
} from '../../../utils/constants/messageConstants';

export class LoginDto {
  @IsEmail({}, { message: EMAIL_MUST_VALID })
  @IsNotEmpty({ message: EMAIL_MUST_NOT_EMPTY })
  email: string;

  @IsNotEmpty({ message: PASSWORD_MUST_NOT_EMPTY })
  password: string;
}
