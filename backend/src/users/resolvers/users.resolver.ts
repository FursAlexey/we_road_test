import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BadRequestException } from '@nestjs/common';

import { UsersService } from '../services';
import { User } from '../entities';
import { CreateUserInput, UpdateUserRolesInput } from '../dto';
import { UserError } from '../errors';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
  listUsers() {
    return this.usersService.find();
  }

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Mutation(() => User)
  async updateUserRoles(
    @Args('updateUserRolesInput') { id, roleIds }: UpdateUserRolesInput,
  ) {
    const userToUpdate = await this.usersService.findOne(id);

    if (!userToUpdate) {
      throw new BadRequestException(UserError.NotFound);
    }

    return this.usersService.updateRoles(userToUpdate, roleIds);
  }

  @Mutation(() => User)
  async removeUser(@Args('id', { type: () => String }) id: string) {
    const userToRemove = await this.usersService.findOne(id);

    if (!userToRemove) {
      throw new BadRequestException(UserError.NotFound);
    }

    await this.usersService.remove(id);

    return userToRemove;
  }
}
