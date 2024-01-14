import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { BadRequestException } from '@nestjs/common';

import { TravelsService } from '../services';
import { Travel } from '../entities';
import { CreateTravelInput, GetTravelsArgs, UpdateTravelInput } from '../dto';
import { TravelError } from '../errors';
import { Roles } from '../../roles/decorators';
import { UserRole } from '../../roles/constants';
import { IsEditor, Public } from '../../auth/decorators';
import { Tour } from '../../tours/entities';
import { ToursService } from '../../tours/services';
import { GetToursArgs } from '../../tours/dto';

@Resolver(() => Travel)
export class TravelsResolver {
  constructor(
    private readonly travelsService: TravelsService,
    private readonly toursService: ToursService,
  ) {}

  @Query(() => [Travel], { name: 'travels' })
  getAll(
    @Args() getTravelsArgs: GetTravelsArgs,
    @IsEditor() isEditor: boolean,
  ) {
    // users can see only public travels
    if (!isEditor) {
      getTravelsArgs.isPublic = true;
    }

    return this.travelsService.getAll(getTravelsArgs);
  }

  @Roles(UserRole.Admin)
  @Mutation(() => Travel)
  createTravel(
    @Args('createTravelInput') createTravelInput: CreateTravelInput,
  ) {
    return this.travelsService.create(createTravelInput);
  }

  @Roles(UserRole.Editor)
  @Mutation(() => Travel)
  async updateTravel(
    @Args('updateTravelInput') updateTravelInput: UpdateTravelInput,
  ) {
    const travelToUpdate = await this.travelsService.getById(
      updateTravelInput.id,
    );

    if (!travelToUpdate) {
      throw new BadRequestException(TravelError.NotFound);
    }

    return this.travelsService.update(travelToUpdate, updateTravelInput);
  }

  @Roles(UserRole.Admin)
  @Mutation(() => Travel)
  async removeTravel(@Args('id', { type: () => String }) id: string) {
    const travelToDelete = await this.travelsService.getById(id);

    if (!travelToDelete) {
      throw new BadRequestException(TravelError.NotFound);
    }

    await this.travelsService.remove(travelToDelete);

    return travelToDelete;
  }

  @Public()
  @ResolveField(() => [Tour])
  async tours(@Parent() travel: Travel, @Args() args: GetToursArgs) {
    const { id } = travel;

    return this.toursService.getAll(id, args);
  }
}
