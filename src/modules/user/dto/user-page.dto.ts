import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class UserPageDto {

  @ApiProperty({ type: UserDto })
  readonly data: UserDto;

  constructor(data: UserDto) {
    this.data = data;
  }
}
