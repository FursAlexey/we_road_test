import { Injectable } from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Travel } from '../entities';
import { GetTravelsArgs } from '../dto';
import { PaginationService } from '../../utils/pagination/services';

@Injectable()
export class TravelsService {
  constructor(
    @InjectRepository(Travel)
    private readonly travelsRepository: Repository<Travel>,
    private readonly paginationService: PaginationService,
  ) {}

  create(entity: DeepPartial<Travel>): Promise<Travel> {
    return this.travelsRepository.save(this.travelsRepository.create(entity));
  }

  async getAll(args: GetTravelsArgs) {
    const { slug, isPublic, limit, offset } = args;

    const qb = this.travelsRepository.createQueryBuilder('travel');

    if (slug) {
      qb.where('travel.slug LIKE :slug', {
        slug: `%${slug}%`,
      });
    }

    if (isPublic !== undefined) {
      qb.andWhere('travel.isPublic = :isPublic', {
        isPublic,
      });
    }

    return this.paginationService.getPaginatedData(qb, {
      limit,
      offset,
      sort: [],
    });
  }

  getById(id: string): Promise<Travel | null> {
    return this.travelsRepository.findOneBy({
      id,
    });
  }

  update(travel: Travel, entity: Partial<Travel>) {
    return this.travelsRepository.save({
      ...travel,
      ...entity,
    });
  }

  async remove(travel: Travel): Promise<void> {
    await this.travelsRepository.remove(travel);
  }
}
