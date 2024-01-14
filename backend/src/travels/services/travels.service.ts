import { Injectable } from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UpdateTravelInput } from '../dto/update-travel.input';
import { Travels } from '../entities';

@Injectable()
export class TravelsService {
  constructor(
    @InjectRepository(Travels)
    private readonly travelsRepository: Repository<Travels>,
  ) {}

  create(entity: DeepPartial<Travels>): Promise<Travels> {
    return this.travelsRepository.save(this.travelsRepository.create(entity));
  }

  findAll() {
    return `This action returns all travels`;
  }

  getById(id: string): Promise<Travels | null> {
    return this.travelsRepository.findOneBy({
      id,
    });
  }

  update(travel: Travels, entity: Partial<Travels>) {
    return this.travelsRepository.save({
      ...travel,
      ...entity,
    })
  }

  async remove(travel: Travels): Promise<void> {
    await this.travelsRepository.remove(travel);
  }
}
