import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsUUID } from 'class-validator';

import { User } from '../entities';

@InputType()
export class CreateUserInput implements Partial<User> {
  @IsEmail()
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => [String], {
    nullable: 'itemsAndList',
  })
  @IsUUID(undefined, {
    each: true,
  })
  roleIds?: string[];
}
