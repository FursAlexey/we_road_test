import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../../users/services';
import { LoginInput } from '../dto';
import { AuthError } from '../errors';
import { HashService } from '../../utils/hash';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
  ) {}

  async login({ email, password }: LoginInput): Promise<string> {
    const user = await this.usersService.getByEmail(email);

    if (!user) {
      throw new UnauthorizedException(AuthError.IncorrectEmailOrPassword);
    }

    const isPasswordValid = await this.hashService.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(AuthError.IncorrectEmailOrPassword);
    }

    return this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
      },
      {
        expiresIn: '8 days',
      },
    );
  }
}
