import { Injectable } from '@nestjs/common';
import { PaginatedData } from '../interfaces';
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

import { PaginationArgs } from '../dto';

@Injectable()
export class PaginationService {
  // TODO: Replace with cursor based pagination
  async getPaginatedData<Entity extends ObjectLiteral>(
    qb: SelectQueryBuilder<Entity>,
    paginationArgs: PaginationArgs,
  ): Promise<PaginatedData<Entity>> {
    const take = paginationArgs.limit;
    const skip = paginationArgs.offset;

    if (paginationArgs.sort.length > 0) {
      const order = Object.fromEntries(
        paginationArgs.sort.map(({ field, direction }) => [
          `"${field}"`.replaceAll('""', '"'),
          direction,
        ]),
      );

      qb.orderBy(order);
    }

    const [data, count] = await qb.take(take).skip(skip).getManyAndCount();

    const hasMore = count > skip + take;

    return {
      data,
      hasMore,
    };
  }
}
