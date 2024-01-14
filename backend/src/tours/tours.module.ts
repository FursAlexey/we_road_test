import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ToursService } from './services';
import { ToursResolver } from './resolvers';
import { Tour } from './entities';
import { TravelsModule } from '../travels/travels.module';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tour]),
    forwardRef(() => TravelsModule),
    UtilsModule,
  ],
  providers: [ToursResolver, ToursService],
  exports: [ToursService],
})
export class ToursModule {}
