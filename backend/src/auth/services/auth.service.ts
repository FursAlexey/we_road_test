import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../../users/services';
import { LoginInput } from '../dto';
import { AuthError } from '../errors';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginInput): Promise<string> {
    const user = await this.usersService.getByEmail(email);

    if (!user) {
      throw new UnauthorizedException(AuthError.IncorrectEmailOrPassword);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(AuthError.IncorrectEmailOrPassword);
    }

    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });
  }
}
