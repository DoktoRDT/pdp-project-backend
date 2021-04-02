import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  firstName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  lastName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  about: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  avatar: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  roleId: string;
}
