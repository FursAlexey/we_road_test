import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

import { SeedService } from '../../database/seeders/seed/seed.service';
import { Role } from '../../roles/entities';
import { User } from '../../users/entities';

@Injectable()
export class TestingService implements OnModuleInit {
  constructor(
    @InjectDataSource()
    private readonly defaultDataSource: DataSource,
    private readonly seedService: SeedService,
  ) {}

  createDefaultRoles(): Promise<Role[]> {
    return this.seedService.createRoles();
  }

  createUsersFromRoles(roles: Role[]): Promise<User[]> {
    return this.seedService.createUsers(roles);
  }

  async cleanUp() {
    await this.defaultDataSource.synchronize(true);
  }

  onModuleInit() {
    return this.defaultDataSource.synchronize();
  }
}
