import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsUUID } from 'class-validator';

import { Users } from '../entities';

@InputType()
export class CreateUserInput implements Partial<Users> {
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
