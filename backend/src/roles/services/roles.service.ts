import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Roles } from '../entities';
import { UserRole } from '../constants';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
  ) {}

  getRolesByIds(ids: string[]): Promise<Roles[]> {
    return this.rolesRepository.findBy({
      id: In(ids),
    });
  }

  getDefaultRole(): Promise<Roles> {
    return this.rolesRepository.findOneByOrFail({
      name: UserRole.User,
    });
  }
}
