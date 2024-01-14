import { Field, InputType, Int } from '@nestjs/graphql';

import { Mood } from '../interfaces';

@InputType()
export class MoodInput implements Mood {
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