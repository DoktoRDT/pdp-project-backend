import { Global, Module } from '@nestjs/common';
import { ConfigService } from './services';

@Global()
@Module({
  providers: [ ConfigService ],
  exports: [ ConfigService ],
})
export class SharedModule {
}
