import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BadRequestException } from '@nestjs/common';

import { UsersService } from '../services';
import { User } from '../entities';
import { CreateUserInput, UpdateUserRolesInput } from '../dto';
import { UserError } from '../errors';
import { Roles } from '../../roles/decorators';
import { UserRole } from '../../roles/constants';
import { ReqUser } from '../decorators';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
  listUsers() {
    return this.usersService.find();
  }

  @Query(() => User, { name: 'me' })
  getActiveUser(@ReqUser() user: User) {
    return user;
  }

  @Roles(UserRole.Admin)
  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Roles(UserRole.Admin)
  @Mutation(() => User)
  async updateUserRoles(
    @Args('updateUserRolesInput') { id, roleIds }: UpdateUserRolesInput,
  ) {
    const userToUpdate = await this.usersService.getById(id);

    if (!userToUpdate) {
      throw new BadRequestException(UserError.NotFound);
    }

    return this.usersService.updateRoles(userToUpdate, roleIds);
  }

  @Roles(UserRole.Admin)
  @Mutation(() => User)
  async removeUser(@Args('id', { type: () => String }) id: string) {
    const userToRemove = await this.usersService.getById(id);

    if (!userToRemove) {
      throw new BadRequestException(UserError.NotFound);
    }

    await this.usersService.remove(id);

    return userToRemove;
  }
}
