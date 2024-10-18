import { IsNotEmpty, IsOptional } from 'class-validator';
import { ROLE_MUST_NOT_EMPTY } from '../../../utils/constants/messageConstants';

export class CreateRoleDto {
  @IsNotEmpty({ message: ROLE_MUST_NOT_EMPTY })
  name: string;

  @IsOptional()
  description: string;
}
