import { Body, Controller, Get, HttpCode, HttpStatus, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { CookieManager, InjectCookieManager } from '../../decorators/cookies';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { LoginPayloadDto, UserLoginDto } from '../user/dto';
import { UserEntity } from '../user/entities';
import { UserService } from '../user/services';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    public readonly authService: AuthService,
    public readonly userService: UserService,
  ) {
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: 'User info with access token',
  })
  async userLogin(
    @Body() userLoginDto: UserLoginDto,
    @InjectCookieManager() cookie: CookieManager,
  ): Promise<LoginPayloadDto> {
    const userEntity = await this.authService.validateUser(userLoginDto);

    const accessToken = await this.authService.createAccessToken(userEntity);
    const refreshToken = await this.authService.createRefreshToken(userEntity);

    cookie.set('refresh.token', refreshToken.token, {
      maxAge: refreshToken.expiresIn,
    });
    return new LoginPayloadDto(userEntity.toDto(), accessToken);
  }

  @Post('refresh')
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: 'Refresh access token',
  })
  async refresh(
    @InjectCookieManager() cookie: CookieManager,
  ) {
    const token = cookie.get('refresh.token');
    const parsed = await this.authService.verifyRefreshTokenOrThrowUnauthorized(token);
    const user = await this.userService.findOne(parsed.userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    const accessToken = await this.authService.createAccessToken(user);
    await this.authService.revokeRefreshToken(parsed.token, user);
    const refreshToken = await this.authService.createRefreshToken(user);

    cookie.set('refresh.token', refreshToken.token, {
      maxAge: refreshToken.expiresIn,
    });

    return new LoginPayloadDto(user.toDto(), accessToken);
  }

  @Get('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Logout',
  })
  async logout(
    @InjectCookieManager() cookie: CookieManager,
    @AuthUser() user: UserEntity,
  ) {
    const token = cookie.get('refresh.token');
    cookie.delete('refresh.token');
    if (!user) {
      throw new UnauthorizedException();
    }
    await this.authService.revokeRefreshToken(token, user);
  }
}
