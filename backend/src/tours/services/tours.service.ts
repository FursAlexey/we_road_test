import { Injectable } from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Tour } from '../entities';
import { GetToursArgs } from '../dto';
import { CurrencyService } from '../../utils/currency';

@Injectable()
export class ToursService {
  constructor(
    @InjectRepository(Tour)
    private readonly toursRepository: Repository<Tour>,
    private readonly currencyService: CurrencyService,
  ) {}

  create(entity: DeepPartial<Tour>): Promise<Tour> {
    return this.toursRepository.save(this.toursRepository.create(entity));
  }

  async getAll(travelId: string, args: GetToursArgs) {
    const { priceFrom, priceTo, startingDate, endingDate, limit, offset } =
      args;

    const qb = this.toursRepository
      .createQueryBuilder('tour')
      .where('tour.travel_id = :travelId', {
        travelId,
      });

    if (priceFrom) {
      qb.andWhere('tour.price >= :priceFrom', {
        priceFrom: this.currencyService.convertToCents(priceFrom),
      });
    }

    if (priceTo) {
      qb.andWhere('tour.price <= :priceFrom', {
        priceTo: this.currencyService.convertToCents(priceTo),
      });
    }

    if (startingDate) {
      qb.andWhere('tour.starting_date >= :startingDate', {
        startingDate: startingDate,
      });
    }

    if (endingDate) {
      qb.andWhere('tour.ending_date <= :endingDate', {
        endingDate: endingDate,
      });
    }

    return qb.take(limit).skip(offset).getMany();
  }

  getById(id: string): Promise<Tour | null> {
    return this.toursRepository.findOneBy({
      id,
    });
  }

  update(tour: Tour, entity: Partial<Tour>) {
    return this.toursRepository.save({
      ...tour,
      ...entity,
    });
  }

  async remove(tour: Tour): Promise<void> {
    await this.toursRepository.remove(tour);
  }
}
