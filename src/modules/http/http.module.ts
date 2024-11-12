import { Global, Module } from '@nestjs/common';
import { AxiosHttpService } from 'mvc-common-toolkit';

import { INJECTION_TOKEN } from '@shared/constants';

@Global()
@Module({
  providers: [
    {
      provide: INJECTION_TOKEN.HTTP_SERIVCE,
      useFactory: () => new AxiosHttpService(),
    },
  ],
  exports: [INJECTION_TOKEN.HTTP_SERIVCE],
})
export class HttpModule {}
