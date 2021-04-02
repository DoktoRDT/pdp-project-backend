import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import ms from 'ms';

export class ConfigService {

  readonly env: dotenv.DotenvParseOutput;

  constructor() {
    this.env = dotenv.config({
      path: '.env',
    }).parsed;
  }

  public getNumber(key: string): number {
    return Number(this.get(key));
  }

  public getTime(key: string): number {
    return ms(this.get(key));
  }

  public get(key: string): string {
    return this.env[key];
  }

  get nodeEnv(): string {
    return this.get('NODE_ENV') || 'development';
  }

  get postgresConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      url: `postgres://${this.get('POSTGRES_USER')}:${this.get('POSTGRES_PASSWORD')}@postgres:5432/${this.get('POSTGRES_DB')}`,
      synchronize: false,
      logging: this.nodeEnv === 'development',
    };
  }

  get jwt() {
    return {
      secret: this.get('JWT_SECRET'),
      accessExpiration: this.getTime('ACCESS_TOKEN_EXPIRATION'),
      refreshExpiration: this.getTime('REFRESH_TOKEN_EXPIRATION'),
    };
  }
}
