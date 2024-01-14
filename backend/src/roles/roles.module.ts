import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RolesService } from './services';
import { Roles } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Roles])],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
