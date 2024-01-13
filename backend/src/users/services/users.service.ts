import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserInput } from '../dto';
import { User } from '../entities';
import { FindManyOptions, Repository } from 'typeorm';
import { RolesService } from '../../roles/services';
import { Role } from '../../roles/entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly rolesService: RolesService,
  ) {}

  async create({ email, password, roleIds }: CreateUserInput): Promise<User> {
    let roles: Role[] = [];

    if (roleIds?.length) {
      roles = await this.rolesService.getRolesByIds(roleIds);
    } else {
      const defaultRole = await this.rolesService.getDefaultRole();

      roles.push(defaultRole);
    }

    return this.usersRepository.save(
      this.usersRepository.create({
        email,
        password,
        roles,
      }),
    );
  }

  find(options?: FindManyOptions<User>): Promise<User[]> {
    return this.usersRepository.find(options);
  }

  findOne(id: string) {
    return this.usersRepository.findOneBy({
      id,
    });
  }

  async updateRoles(user: User, roleIds: string[]): Promise<User> {
    user.roles = await this.rolesService.getRolesByIds(roleIds);

    return this.usersRepository.save(user);
  }

  async remove(id: string) {
    await this.usersRepository.delete({
      id,
    });
  }
}
