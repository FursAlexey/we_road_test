import { ArgsType, Field, Float, Int } from '@nestjs/graphql';

import { Tour } from '../entities';

@ArgsType()
export class GetToursArgs implements Partial<Tour> {
  @Field(() => Float, { nullable: true })
  priceFrom?: number;

  @Field(() => Float, { nullable: true })
  priceTo?: number;

  @Field(() => Date, { nullable: true })
  startingDate?: Date;

  @Field(() => Date, { nullable: true })
  endingDate?: Date;

  @Field(() => Int, { nullable: true })
  offset?: number = 0;

  @Field(() => Int, { nullable: true })
  limit?: number = 10;
}
