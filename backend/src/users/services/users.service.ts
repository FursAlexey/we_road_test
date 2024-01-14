import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserInput } from '../dto';
import { Users } from '../entities';
import { FindManyOptions, Repository } from 'typeorm';
import { RolesService } from '../../roles/services';
import { Roles } from '../../roles/entities';
import { HashService } from '../../utils/hash/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly rolesService: RolesService,
    private readonly hashService: HashService,
  ) {}

  async create({ email, password, roleIds }: CreateUserInput): Promise<Users> {
    let roles: Roles[] = [];

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

  find(options?: FindManyOptions<Users>): Promise<Users[]> {
    return this.usersRepository.find(options);
  }

  getById(id: string): Promise<Users | null> {
    return this.usersRepository.findOne({
      where: {
        id,
      },
      relations: ['roles'],
    });
  }

  getByEmail(email: string): Promise<Users | null> {
    return this.usersRepository.findOne({
      where: {
        email: email.toLowerCase(),
      },
      relations: ['roles'],
    });
  }

  async updateRoles(user: Users, roleIds: string[]): Promise<Users> {
    user.roles = await this.rolesService.getRolesByIds(roleIds);

    return this.usersRepository.save(user);
  }

  async remove(id: string) {
    await this.usersRepository.delete({
      id,
    });
  }
}
