import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { CookieOptions } from 'express';

export class CookieManager {
  constructor(private readonly ctx: ExecutionContextHost) {
  }

  set(name: string, value: string, options: CookieOptions = {}) {
    this.ctx.switchToHttp().getResponse().cookie(name, value, {
      httpOnly: true,
      sameSite: 'strict',
      ...options,
    });
  }

  get(name: string): string {
    return this.ctx.switchToHttp().getRequest().cookies[name];
  }

  delete(name: string) {
    this.ctx.switchToHttp().getResponse().clearCookie(name);
  }
}
