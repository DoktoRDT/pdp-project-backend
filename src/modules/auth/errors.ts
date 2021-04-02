/* eslint-disable max-classes-per-file */

import { BadRequestException, ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common';

export class InvalidOrExpiredAuthTokenError extends UnauthorizedException {
  textKey: string;

  constructor() {
    super('Invalid or expired auth token');
    this.textKey = 'txt_invalid_or_expired_auth_token';
  }
}

export class InvalidEmailOrPasswordError extends NotFoundException {
  textKey: string;

  constructor() {
    super('Invalid user or password');
    this.textKey = 'txt_invalid_user_or_password';
  }
}

export class UserNotActiveError extends ForbiddenException {
  textKey: string;

  constructor() {
    super('User not active');
    this.textKey = 'txt_user_not_active';
  }
}

export class EmailAlreadyInUseError extends BadRequestException {
  textKey: string;

  constructor() {
    super('This email is already in use');
    this.textKey = 'txt_email_in_use';
  }
}
