import { ArgsType, Field, Int, registerEnumType } from '@nestjs/graphql';

import { SortArgs } from './sort-args';
import { SortDirection } from '../constants';

registerEnumType(SortDirection, {
  name: 'SortDirection',
});

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true })
  limit = 10;

  @Field(() => Int, { nullable: true })
  offset = 0;

  @Field(() => [SortArgs], { nullable: true })
  sort: SortArgs[] = [];
}
