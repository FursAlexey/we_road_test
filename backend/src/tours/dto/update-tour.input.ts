import { InputType, Field, PartialType, OmitType } from '@nestjs/graphql';

import { CreateTourInput } from './create-tour.input';

@InputType()
export class UpdateTourInput extends PartialType(OmitType(CreateTourInput, ['travelId'] as const)) {
  @Field(() => String)
  tourId: string;
}
