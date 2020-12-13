import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

function getEnv(key: string): string {
  return process.env[key];
}

export class ConfigService {

  constructor() {
    dotenv.config({
      path: '.env',
    });
  }

  public get(key: string): string {
    return getEnv(key);
  }

  public getNumber(key): number {
    return Number(this.get(key));
  }

  get nodeEnv(): string {
    return this.get('NODE_ENV') || 'development';
  }

  get postgresConfig(): TypeOrmModuleOptions {
    return {
      name: 'postgres',
      type: 'postgres',
      url: `postgres://${this.get('POSTGRES_USER')}:${this.get('POSTGRES_PASSWORD')}@postgres:5432/${this.get('POSTGRES_DB')}`,
      synchronize: false,
      logging: this.nodeEnv === 'development',
    };
  }
}
