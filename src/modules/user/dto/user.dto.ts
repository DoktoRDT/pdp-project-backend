import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto, RoleTypes } from '../../../common/constants';
import { UserEntity } from '../entities';

export class UserDto extends AbstractDto {

  @ApiProperty({ required: false })
  firstName: string;

  @ApiProperty({ required: false })
  lastName: string;

  @ApiProperty({ required: false })
  about: string;

  @ApiProperty({ required: false })
  avatar: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: RoleTypes, enumName: 'RoleTypes' })
  role: RoleTypes;

  constructor(user: UserEntity) {
    super(user);
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.avatar = user.avatar;
    this.about = user.about;
    this.email = user.email;
    this.role = user.role?.name;
  }
}
