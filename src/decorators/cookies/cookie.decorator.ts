import { createParamDecorator } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { CookieManager } from './cookie.manager';

export const InjectCookieManager = createParamDecorator((data: unknown, ctx: ExecutionContextHost) => new CookieManager(ctx));
