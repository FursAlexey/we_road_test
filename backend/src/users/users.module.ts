import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './services';
import { UsersResolver } from './resolvers/users.resolver';
import { User } from './entities';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RolesModule],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
