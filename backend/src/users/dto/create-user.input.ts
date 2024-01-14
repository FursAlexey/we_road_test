import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsUUID } from 'class-validator';

import { User } from '../entities';

@InputType()
export class CreateUserInput implements Partial<User> {
  @IsEmail()
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @IsUUID(undefined, {
    each: true,
  })
  @IsOptional()
  @Field(() => [String], {
    nullable: 'itemsAndList',
  })
  roleIds?: string[];
}
