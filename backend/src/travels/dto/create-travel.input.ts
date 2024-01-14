import { InputType, Int, Field } from '@nestjs/graphql';

import { Travels } from '../entities';
import { Mood } from '../interfaces';
import { MoodInput } from './mood.input';

@InputType()
export class CreateTravelInput implements Partial<Travels> {
  @Field(() => String)
  name: string;

  @Field(() => Int)
  numberOfDays: number;

  @Field(() => String)
  description: string;

  @Field(() => Boolean)
  isPublic: boolean;

  @Field(() => MoodInput)
  mood: Mood;
}
