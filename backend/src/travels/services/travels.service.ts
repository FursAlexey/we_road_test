import { Injectable } from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Travel } from '../entities';

@Injectable()
export class TravelsService {
  constructor(
    @InjectRepository(Travel)
    private readonly travelsRepository: Repository<Travel>,
  ) {}

  create(entity: DeepPartial<Travel>): Promise<Travel> {
    return this.travelsRepository.save(this.travelsRepository.create(entity));
  }

  findAll() {
    return `This action returns all travels`;
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
    })
  }

  async remove(travel: Travel): Promise<void> {
    await this.travelsRepository.remove(travel);
  }
}
