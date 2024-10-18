import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsStrongPassword,
} from 'class-validator';
import {
  ADDRESS_MUST_NOT_EMPTY,
  EMAIL_MUST_NOT_EMPTY,
  EMAIL_MUST_VALID,
  NAME_MUST_NOT_EMPTY,
  PASSWORD_MUST_NOT_EMPTY,
  PASSWORD_NOT_STRONG,
  ROLE_MUST_NOT_EMPTY,
  ROLE_ID_MUST_NUMBER,
  COMPANY_ID_MUST_NUMBER,
  COMPANY_MUST_NOT_EMPTY,
  GENDER_MUST_NOT_EMPTY,
  PHONE_MUST_NOT_EMPTY,
  GENDER_ID_MUST_NUMBER,
} from '../../../utils/constants/messageConstants';

export class CreateUserDto {
  @IsEmail({}, { message: EMAIL_MUST_VALID })
  @IsNotEmpty({ message: EMAIL_MUST_NOT_EMPTY })
  email: string;

  @IsStrongPassword(
    {
      minLength: 6,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message: PASSWORD_NOT_STRONG,
    },
  )
  @IsNotEmpty({ message: PASSWORD_MUST_NOT_EMPTY })
  password: string;

  @IsNotEmpty({ message: NAME_MUST_NOT_EMPTY })
  name: string;

  @IsNumber({}, { message: GENDER_ID_MUST_NUMBER })
  @IsNotEmpty({ message: GENDER_MUST_NOT_EMPTY })
  genderId: number;

  @IsNotEmpty({ message: PHONE_MUST_NOT_EMPTY })
  phoneNumber: string;

  @IsNotEmpty({ message: ADDRESS_MUST_NOT_EMPTY })
  address: string;

  @IsNumber({}, { message: COMPANY_ID_MUST_NUMBER })
  @IsNotEmpty({ message: COMPANY_MUST_NOT_EMPTY })
  companyId: number;

  @IsNumber({}, { message: ROLE_ID_MUST_NUMBER })
  @IsNotEmpty({ message: ROLE_MUST_NOT_EMPTY })
  roleId: number;
}
