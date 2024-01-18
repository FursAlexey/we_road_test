import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RolesService } from './services';
import { Role } from './entities';
import { RolesResolver } from './resolvers';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [RolesService, RolesResolver],
  exports: [RolesService],
})
export class RolesModule {}
