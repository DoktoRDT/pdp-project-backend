import { ApiProperty } from '@nestjs/swagger';
import { Length, Validate } from 'class-validator';
import { EmailValidator } from '../../../pipes/validators/email.validator';

export class LoginDto {

  @ApiProperty()
  @Length(5, 100)
  @Validate(EmailValidator)
  email: string;

  @ApiProperty()
  @Length(5, 100)
  password: string;
}
