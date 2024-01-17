import { InputType, Field, Float } from '@nestjs/graphql';

import { Tour } from '../entities';
import { IsPositive } from 'class-validator';

@InputType()
export class CreateTourInput implements Partial<Tour> {
  @Field(() => String)
  travelId: string;

  @Field(() => String)
  name: string;

  @Field(() => Date)
  startingDate: Date;

  @Field(() => Date)
  endingDate: Date;

  @IsPositive()
  @Field(() => Float)
  price: number;
}
