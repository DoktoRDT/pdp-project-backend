import { UnauthorizedException } from '@nestjs/common';

export class InvalidRefreshTokenError extends UnauthorizedException {
}
