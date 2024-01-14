import { Module } from '@nestjs/common';

import { TravelsService } from './services';
import { TravelsResolver } from './resolvers';

@Module({
  providers: [TravelsResolver, TravelsService],
})
export class TravelsModule {}
