import { ArgsType, Field, Float } from '@nestjs/graphql';

import { Tour } from '../entities';
import { PaginationArgs } from '../../utils/pagination/dto';

@ArgsType()
export class GetToursArgs extends PaginationArgs implements Partial<Tour> {
  @Field(() => Float, { nullable: true })
  priceFrom?: number;

  @Field(() => Float, { nullable: true })
  priceTo?: number;

  @Field(() => Date, { nullable: true })
  startingDate?: Date;

  @Field(() => Date, { nullable: true })
  endingDate?: Date;
}
