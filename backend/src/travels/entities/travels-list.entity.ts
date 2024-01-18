import { Field, ObjectType } from '@nestjs/graphql';

import { PaginatedData } from '../../utils/pagination/interfaces';
import { Travel } from './travel.entity';

@ObjectType()
export class TravelList implements PaginatedData<Travel> {
  @Field(() => [Travel])
  data: Travel[];

  @Field(() => Boolean)
  hasMore: boolean;
}
