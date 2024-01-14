import { Resolver, Mutation, Args } from '@nestjs/graphql';

import { AuthService } from '../services';
import { LoginInput } from '../dto';
import { Public } from '../decorators';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => String)
  login(@Args('loginInput') loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }
}
