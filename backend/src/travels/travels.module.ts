import { Module } from '@nestjs/common';

import { TravelsService } from './services';
import { TravelsResolver } from './resolvers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Travel } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Travel])],
  providers: [TravelsResolver, TravelsService],
})
export class TravelsModule {}
