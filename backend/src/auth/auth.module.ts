import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { ConfigType } from '@nestjs/config';

import { AuthService } from './services';
import { AuthResolver } from './resolvers';
import { UsersModule } from '../users/users.module';
import { AuthGuard, RolesGuard } from './guards';
import { UtilsModule } from '../utils/utils.module';
import authConfig from '../config/auth.config';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      inject: [authConfig.KEY],
      useFactory: (authConf: ConfigType<typeof authConfig>) => {
        return {
          secret: authConf.jwtSecret,
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
