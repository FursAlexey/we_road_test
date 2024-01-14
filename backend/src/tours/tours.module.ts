import { Module } from '@nestjs/common';

import { ToursService } from './services';
import { ToursResolver } from './resolvers';

@Module({
  providers: [ToursResolver, ToursService],
})
export class ToursModule {}
