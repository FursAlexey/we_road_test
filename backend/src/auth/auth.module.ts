import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';

import { AuthService } from './services';
import { AuthResolver } from './resolvers';
import { UsersModule } from '../users/users.module';
import { AuthGuard, RolesGuard } from './guards';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory: () => {
        // todo: use config
        return {
          secret: process.env.JWT_SECRET || 'secret',
          signOptions: { expiresIn: '8h' },
        };
      },
    }),
    UsersModule,
    UtilsModule,
  ],
  providers: [
    AuthResolver,
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AuthModule {}
