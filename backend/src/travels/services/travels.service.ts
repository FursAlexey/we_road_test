import { Injectable } from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Travel } from '../entities';
import { GetTravelsArgs } from '../dto';

@Injectable()
export class TravelsService {
  constructor(
    @InjectRepository(Travel)
    private readonly travelsRepository: Repository<Travel>,
  ) {}

  create(entity: DeepPartial<Travel>): Promise<Travel> {
    return this.travelsRepository.save(this.travelsRepository.create(entity));
  }

  async getAll({ slug, isPublic, limit, offset }: GetTravelsArgs) {
    const qb = this.travelsRepository.createQueryBuilder('travel');

    if (slug) {
      qb.where('travel.slug LIKE :slug', {
        slug: `%${slug}%`,
      });
    }

    if (isPublic !== undefined) {
      qb.andWhere('travel.is_public = :isPublic', {
        isPublic,
      });
    }

    return qb.take(limit).skip(offset).getMany();
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
