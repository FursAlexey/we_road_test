import { Injectable } from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Tour } from '../entities';
import { GetToursArgs } from '../dto';
import { CurrencyService } from '../../utils/currency';
import { Travel } from '../../travels/entities';
import { PaginationService } from '../../utils/pagination/services';
import { PaginatedData } from '../../utils/pagination/interfaces';
import { SortDirection } from '../../utils/pagination/constants';

@Injectable()
export class ToursService {
  constructor(
    @InjectRepository(Tour)
    private readonly toursRepository: Repository<Tour>,
    private readonly currencyService: CurrencyService,
    private readonly paginationService: PaginationService,
  ) {}

  create(travel: Travel, entity: DeepPartial<Tour>): Promise<Tour> {
    return this.toursRepository.save(
      this.toursRepository.create({
        ...entity,
        travel,
      }),
    );
  }

  async getAll(
    travelId: string,
    args: GetToursArgs,
  ): Promise<PaginatedData<Tour>> {
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
      qb.andWhere('tour.price <= :priceTo', {
        priceTo: this.currencyService.convertToCents(priceTo),
      });
    }

    if (startingDate) {
      qb.andWhere('DATE(tour.startingDate) >= :startingDate', {
        startingDate: startingDate,
      });
    }

    if (endingDate) {
      qb.andWhere('DATE(tour.endingDate) <= :endingDate', {
        endingDate: endingDate,
      });
    }

    // use startingDate sort by default
    if (!args.sort.some(({ field }) => field === 'startingDate')) {
      args.sort.push({
        field: '"startingDate"',
        direction: SortDirection.ASC,
      });
    }

    return this.paginationService.getPaginatedData(qb, {
      limit,
      offset,
      sort: args.sort,
    });
  }

  getById(id: string): Promise<Tour | null> {
    return this.toursRepository.findOneBy({
      id,
    });
  }

  update(tour: Tour, entity: Partial<Tour>) {
    return this.toursRepository.save(
      this.toursRepository.create({
        ...tour,
        ...entity,
      }),
    );
  }

  async remove(tour: Tour): Promise<void> {
    await this.toursRepository.remove(tour);
  }
}
