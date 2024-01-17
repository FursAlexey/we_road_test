import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { BadRequestException } from '@nestjs/common';

import { ToursService } from '../services';
import { Tour } from '../entities';
import { CreateTourInput, UpdateTourInput } from '../dto';
import { TourError } from '../errors';
import { TravelsService } from '../../travels/services';
import { TravelError } from '../../travels/errors';
import { Roles } from '../../roles/decorators';
import { UserRole } from '../../roles/constants';

@Resolver(() => Tour)
export class ToursResolver {
  constructor(
    private readonly toursService: ToursService,
    private readonly travelsService: TravelsService,
  ) {}

  @Roles(UserRole.Admin)
  @Mutation(() => Tour)
  async createTour(@Args('createTourInput') createTourInput: CreateTourInput) {
    const travel = await this.travelsService.getById(createTourInput.travelId);

    if (!travel) {
      throw new BadRequestException(TravelError.NotFound);
    }

    return this.toursService.create(travel, createTourInput);
  }

  @Roles(UserRole.Editor)
  @Mutation(() => Tour)
  async updateTour(@Args('updateTourInput') updateTourInput: UpdateTourInput) {
    const tourToUpdate = await this.toursService.getById(
      updateTourInput.tourId,
    );

    if (!tourToUpdate) {
      throw new BadRequestException(TourError.NotFound);
    }

    return this.toursService.update(tourToUpdate, updateTourInput);
  }

  @Roles(UserRole.Admin)
  @Mutation(() => Boolean)
  async removeTour(@Args('id', { type: () => String }) id: string) {
    const toutToDelete = await this.toursService.getById(id);

    if (!toutToDelete) {
      throw new BadRequestException(TourError.NotFound);
    }

    await this.toursService.remove(toutToDelete);

    return true;
  }
}
