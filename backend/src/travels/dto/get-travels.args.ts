import { ArgsType, Field } from '@nestjs/graphql';

import { Travel } from '../entities';
import { PaginationArgs } from '../../utils/pagination/dto';

@ArgsType()
export class GetTravelsArgs extends PaginationArgs implements Partial<Travel> {
  @Field(() => String, { nullable: true })
  slug?: string;

  @Field(() => Boolean, { nullable: true })
  isPublic?: boolean;
}
