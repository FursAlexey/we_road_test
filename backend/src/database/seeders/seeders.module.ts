import { Module } from '@nestjs/common';

import { SeedService } from './seed/seed.service';
import { UsersModule } from '../../users/users.module';
import { RolesModule } from '../../roles/roles.module';
import { UtilsModule } from '../../utils/utils.module';

@Module({
  imports: [UsersModule, RolesModule, UtilsModule],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedersModule {}
