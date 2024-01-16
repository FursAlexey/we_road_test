import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Role } from '../entities';
import { UserRole } from '../constants';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  getAllRoles(): Promise<Role[]> {
    return this.rolesRepository.find();
  }

  getRolesByIds(ids: string[]): Promise<Role[]> {
    return this.rolesRepository.findBy({
      id: In(ids),
    });
  }

  getDefaultRole(): Promise<Role> {
    return this.rolesRepository.findOneByOrFail({
      name: UserRole.User,
    });
  }
}
