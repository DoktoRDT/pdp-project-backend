import { ApiProperty } from '@nestjs/swagger';

export class TokenPayloadDto {
  @ApiProperty()
  expiresIn: number;

  @ApiProperty()
  expiresAt: number;

  @ApiProperty()
  token: string;

  constructor(data: { expiresIn: number; expiresAt: number | Date; token: string }) {
    this.expiresIn = data.expiresIn;
    this.expiresAt = typeof data.expiresAt === 'number' ? data.expiresAt : data.expiresAt.valueOf();
    this.token = data.token;
  }
}
