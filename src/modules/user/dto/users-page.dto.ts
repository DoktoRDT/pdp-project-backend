import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDto } from '../../../common/constants';
import { UserDto } from './user.dto';

export class UsersPageDto {
  @ApiProperty({ type: UserDto })
  readonly data: UserDto[];

  @ApiProperty({ type: PageMetaDto })
  readonly meta: PageMetaDto;

  constructor(data: UserDto[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
