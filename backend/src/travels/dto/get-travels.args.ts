import { ArgsType, Field, Int } from '@nestjs/graphql';

import { Travel } from '../entities';

@ArgsType()
export class GetTravelsArgs implements Partial<Travel> {
  @Field(() => String, { nullable: true })
  slug?: string;

  @Field(() => Boolean, { nullable: true })
  isPublic?: boolean;

  @Field(() => Int, { nullable: true })
  offset: number = 0;

  @Field(() => Int, { nullable: true })
  limit: number = 10;
}
