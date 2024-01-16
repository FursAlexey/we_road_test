import { Query, Resolver } from '@nestjs/graphql';

import { RolesService } from '../services';
import { Role } from '../entities';
import { Roles } from '../decorators';
import { UserRole } from '../constants';

@Resolver(() => Role)
export class RolesResolver {
  constructor(private readonly rolesService: RolesService) {}

  @Roles(UserRole.Admin)
  @Query(() => [Role], { name: 'roles' })
  listRoles() {
    return this.rolesService.getAllRoles();
  }
}
