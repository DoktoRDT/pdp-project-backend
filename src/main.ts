import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './shared/services';
import { SharedModule } from './shared/shared.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const configService = app.select(SharedModule).get(ConfigService);
  await app.listen(configService.get('APP_PORT'));
}

bootstrap()
  .catch(console.error);
