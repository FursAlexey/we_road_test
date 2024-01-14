import { Injectable } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

import { UserRole } from '../../../roles/constants';
import { Roles } from '../../../roles/entities';
import { Users } from '../../../users/entities';
import { HashService } from '../../../utils/hash/hash.service';

@Injectable()
export class SeedService {
  constructor(
    @InjectDataSource()
    private readonly defaultDataSource: DataSource,
    private readonly hashService: HashService,
  ) {}

  async seed() {
    const roles = await this.createRoles();
    await this.createUsers(roles);
  }

  async createRoles(): Promise<Roles[]> {
    const rolesRepository = this.defaultDataSource.getRepository(Roles);

    await Promise.all(
      Object.values(UserRole).map((role) => {
        return rolesRepository.upsert(
          rolesRepository.create({
            name: role,
          }),
          {
            conflictPaths: {
              name: true,
            },
            skipUpdateIfNoValuesChanged: true,
          },
        );
      }),
    );

    return rolesRepository.find();
  }

  async createUsers(roles: Roles[]): Promise<void> {
    const usersRepository = this.defaultDataSource.getRepository(Users);
    const existingUsers = await usersRepository.findBy({
      email: In(roles.map((role) => this.createEmailByRoleName(role.name))),
    });

    for (const role of roles) {
      const email = this.createEmailByRoleName(role.name);
      const existingUser = existingUsers.find((user) => user.email === email);

      const rolesToAssign = [];

      if (role.name === UserRole.Admin) {
        rolesToAssign.push(...roles);
      } else if (role.name === UserRole.Editor) {
        rolesToAssign.push(
          ...roles.filter((role) => role.name !== UserRole.Admin),
        );
      } else {
        rolesToAssign.push(role);
      }

      if (!existingUser) {
        usersRepository.save(
          usersRepository.create({
            email,
            password: await this.hashService.getHash(role.name),
            roles: rolesToAssign,
          }),
        );
      }
    }
  }

  createEmailByRoleName(role: UserRole): string {
    return `${role}@weroad.com`.toLowerCase();
  }
}
