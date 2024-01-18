import { Module } from '@nestjs/common';

import { HashService } from './hash';
import { CurrencyService } from './currency';
import { PaginationService } from './pagination/services';

@Module({
  providers: [HashService, CurrencyService, PaginationService],
  exports: [HashService, CurrencyService, PaginationService],
})
export class UtilsModule {}
