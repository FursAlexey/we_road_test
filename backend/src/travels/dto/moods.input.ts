import { Field, InputType, Int } from '@nestjs/graphql';

import { Moods } from '../entities';

@InputType()
export class MoodsInput implements Moods {
  @Field(() => Int)
  culture: number;

  @Field(() => Int)
  relax: number;

  @Field(() => Int)
  party: number;

  @Field(() => Int)
  nature: number;

  @Field(() => Int)
  history: number;
}