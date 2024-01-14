import { Module } from '@nestjs/common';

import { TravelsService } from './services';
import { TravelsResolver } from './resolvers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Travels } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Travels])],
  providers: [TravelsResolver, TravelsService],
})
export class TravelsModule {}
