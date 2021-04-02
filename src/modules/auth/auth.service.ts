import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { addSeconds } from 'date-fns';
import { Repository } from 'typeorm';
import { UserNotFoundException } from '../../exceptions/user-not-found.exception';
import { UtilsService } from '../../providers/utils.service';
import { ConfigService } from '../../shared/services';
import { TokenPayloadDto, UserLoginDto } from '../user/dto';
import { UserEntity } from '../user/entities';
import { InvalidRefreshTokenError } from '../user/errors/invalid-refresh-token.error';
import { UserService } from '../user/services';
import { RefreshTokenEntity } from './entities/refresh-token.entity';

@Injectable()
export class AuthService {

  constructor(
    public readonly jwtService: JwtService,
    public readonly configService: ConfigService,
    public readonly userService: UserService,
    @InjectRepository(RefreshTokenEntity)
    public readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
  ) {
  }

  async createAccessToken(user: UserEntity): Promise<TokenPayloadDto> {
    return new TokenPayloadDto({
      expiresIn: this.configService.jwt.accessExpiration,
      expiresAt: Date.now() + this.configService.jwt.accessExpiration,
      token: await this.jwtService.signAsync({ id: user.id }),
    });
  }

  async createRefreshToken(user: UserEntity): Promise<RefreshTokenEntity> {
    const date = new Date();
    const entity = new RefreshTokenEntity();
    entity.token = UtilsService.generateRandomStringOldVersion(64);
    entity.expiresIn = this.configService.jwt.refreshExpiration;
    entity.expiresAt = addSeconds(date, this.configService.jwt.refreshExpiration);
    entity.userId = user.id;
    return this.refreshTokenRepository.save(entity);
  }

  async verifyRefreshTokenOrThrowUnauthorized(token: string) {
    const refreshToken = await this.refreshTokenRepository.findOne({ token });

    if (!refreshToken || refreshToken.isExpired) {
      throw new InvalidRefreshTokenError();
    }

    return refreshToken;
  }

  async revokeRefreshToken(token: string, user: UserEntity) {
    const refreshToken = await this.refreshTokenRepository.findOne({ token });
    if (refreshToken?.userId === user.id) {
      await this.refreshTokenRepository.remove(refreshToken);
    }
  }

  async validateUser(userLoginDto: UserLoginDto): Promise<UserEntity> {
    const user = await this.userService.findOneByEmail(userLoginDto.email);
    const isPasswordValid = await UtilsService.validateHash(
      userLoginDto.password,
      user?.password,
    );
    if (!user || !isPasswordValid) {
      throw new UserNotFoundException();
    }
    return user;
  }
}
