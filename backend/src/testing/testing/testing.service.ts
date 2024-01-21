import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

import { SeedService } from '../../database/seeders/seed/seed.service';

@Injectable()
export class TestingService implements OnModuleInit {
  constructor(
    @InjectDataSource()
    private readonly defaultDataSource: DataSource,
    private readonly seedService: SeedService,
  ) {}

  async createDefaultRolesAndUsers() {
    const roles = await this.seedService.createRoles();
    await this.seedService.createUsers(roles);
  }

  async cleanUp() {
    await this.defaultDataSource.synchronize(true);
  }

  onModuleInit() {
    return this.defaultDataSource.synchronize();
  }
}
