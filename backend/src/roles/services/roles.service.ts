import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Role } from '../entities';
import { UserRole } from '../constants';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  getRolesByIds(ids: string[]): Promise<Role[]> {
    return this.roleRepository.findBy({
      id: In(ids),
    });
  }

  getDefaultRole(): Promise<Role> {
    return this.roleRepository.findOneByOrFail({
      name: UserRole.User,
    });
  }
}
