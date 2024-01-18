import { Field, ObjectType } from '@nestjs/graphql';

import { PaginatedData } from '../../utils/pagination/interfaces';
import { Tour } from './tour.entity';

@ObjectType()
export class ToursList implements PaginatedData<Tour> {
  @Field(() => [Tour])
  data: Tour[];

  @Field(() => Boolean)
  hasMore: boolean;
}
