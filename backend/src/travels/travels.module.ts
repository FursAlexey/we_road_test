import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TravelsService } from './services';
import { TravelsResolver } from './resolvers';
import { Travel } from './entities';
import { ToursModule } from '../tours/tours.module';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Travel]),
    forwardRef(() => ToursModule),
    UtilsModule,
  ],
  providers: [TravelsResolver, TravelsService],
  exports: [TravelsService],
})
export class TravelsModule {}
