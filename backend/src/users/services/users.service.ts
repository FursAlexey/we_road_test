import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserInput } from '../dto';
import { User } from '../entities';
import { FindManyOptions, Repository } from 'typeorm';
import { RolesService } from '../../roles/services';
import { Role } from '../../roles/entities';
import { HashService } from '../../utils/hash/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly rolesService: RolesService,
    private readonly hashService: HashService,
  ) {}

  async create({ email, password, roleIds }: CreateUserInput): Promise<User> {
    let roles: Role[] = [];

    if (roleIds?.length) {
      roles = await this.rolesService.getRolesByIds(roleIds);
    } else {
      const defaultRole = await this.rolesService.getDefaultRole();

      roles.push(defaultRole);
    }

    const passwordHash = await this.hashService.getHash(password);

    return this.usersRepository.save(
      this.usersRepository.create({
        email,
        password: passwordHash,
        roles,
      }),
    );
  }

  find(options?: FindManyOptions<User>): Promise<User[]> {
    return this.usersRepository.find(options);
  }

  getById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        id,
      },
      relations: ['roles'],
    });
  }

  getByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        email: email.toLowerCase(),
      },
      relations: ['roles'],
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
