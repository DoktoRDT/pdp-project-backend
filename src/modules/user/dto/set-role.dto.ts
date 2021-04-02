import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { RoleTypes } from '../../../common/constants';

export class SetRoleDto {

  @ApiProperty({ enum: RoleTypes })
  @IsEnum(RoleTypes)
  role: RoleTypes;
}
