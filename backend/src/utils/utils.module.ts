import { Module } from '@nestjs/common';

import { HashService } from './hash';
import { CurrencyService } from './currency';

@Module({
  providers: [HashService, CurrencyService],
  exports: [HashService, CurrencyService],
})
export class UtilsModule {}
