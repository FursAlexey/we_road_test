import { forwardRef, Module } from '@nestjs/common';

import { TravelsService } from './services';
import { TravelsResolver } from './resolvers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Travel } from './entities';
import { ToursModule } from '../tours/tours.module';

@Module({
  imports: [TypeOrmModule.forFeature([Travel]), forwardRef(() => ToursModule)],
  providers: [TravelsResolver, TravelsService],
  exports: [TravelsService],
})
export class TravelsModule {}
