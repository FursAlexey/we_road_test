import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BadRequestException } from '@nestjs/common';

import { TravelsService } from '../services';
import { Travels } from '../entities';
import { CreateTravelInput, UpdateTravelInput } from '../dto';
import { TravelError } from '../errors';

@Resolver(() => Travels)
export class TravelsResolver {
  constructor(private readonly travelsService: TravelsService) {}

  @Query(() => [Travels], { name: 'travels' })
  getAll() {
    return this.travelsService.findAll();
  }

  @Mutation(() => Travels)
  createTravel(
    @Args('createTravelInput') createTravelInput: CreateTravelInput,
  ) {
    return this.travelsService.create(createTravelInput);
  }

  @Mutation(() => Travels)
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

  @Mutation(() => Travels)
  async removeTravel(@Args('id', { type: () => String }) id: string) {
    const travelToDelete = await this.travelsService.getById(id);

    if (!travelToDelete) {
      throw new BadRequestException(TravelError.NotFound);
    }

    await this.travelsService.remove(travelToDelete);

    return travelToDelete;
  }
}
