import { InputType, Field, MiddlewareContext, NextFn } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class LoginInput {
  @Field(() => String, {
    middleware: [
      async (ctx: MiddlewareContext, next: NextFn) => {
        const value = await next();
        console.log(value);
        return value.toLowerCase();
      },
    ],
  })
  @IsEmail()
  email: string;

  @Field(() => String)
  password: string;
}
