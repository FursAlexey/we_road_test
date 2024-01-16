import { InputType, Int, Field } from '@nestjs/graphql';

import { Moods, Travel } from '../entities';
import { MoodsInput } from './moods.input';

@InputType()
export class CreateTravelInput implements Partial<Travel> {
  @Field(() => String)
  name: string;

  @Field(() => Int)
  numberOfDays: number;

  @Field(() => String)
  description: string;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  isPublic: boolean;

  @Field(() => MoodsInput)
  moods: Moods;
}
