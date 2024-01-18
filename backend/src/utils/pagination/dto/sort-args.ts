import { Field, InputType } from '@nestjs/graphql';

import { SortDirection } from '../constants';

@InputType()
export class SortArgs {
  @Field(() => String)
  field: string;

  @Field(() => SortDirection, { nullable: true })
  direction: SortDirection = SortDirection.ASC;
}
