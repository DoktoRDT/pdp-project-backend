import { Column, Entity, PrimaryColumn } from 'typeorm';
import { TokenPayloadDto } from '../../user/dto';

@Entity({ name: 'refresh_tokens' })
export class RefreshTokenEntity {

  @PrimaryColumn({ name: 'token', type: 'varchar' })
  token: string;

  @Column({ name: 'user_id', type: 'bigint' })
  userId: string;

  @Column({ name: 'expires_at', type: 'timestamp with time zone' })
  expiresAt: Date;

  expiresIn: number;

  get isExpired() {
    return this.expiresAt.valueOf() <= Date.now();
  }

  toDto(): TokenPayloadDto {
    return new TokenPayloadDto(this);
  }
}
