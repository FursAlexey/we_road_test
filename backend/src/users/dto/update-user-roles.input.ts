import { InputType, Field } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateUserRolesInput {
  @Field(() => String)
  @IsUUID()
  id: string;

  @Field(() => [String])
  @IsUUID(undefined, {
    each: true,
  })
  roleIds: string[];
}
