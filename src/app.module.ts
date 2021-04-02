import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { RefreshTokenEntity } from './modules/auth/entities/refresh-token.entity';
import { RoleEntity } from './modules/auth/entities/role-entity';
import { UserEntity } from './modules/user/entities';
import { UserModule } from './modules/user/user.module';
import { ConfigService } from './shared/services';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ SharedModule ],
      useFactory: async (configService: ConfigService) => ({
        ...configService.postgresConfig,
        entities: [
          UserEntity, RefreshTokenEntity, RoleEntity,
        ],
      }),
      inject: [ ConfigService ],
    }),
    SharedModule,
    AuthModule,
    UserModule,
  ],
  controllers: [ AppController ],
  providers: [ AppService ],
})
export class AppModule {
}
