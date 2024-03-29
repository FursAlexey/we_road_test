import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';
import { AuthModule } from '../auth/auth.module';
import { SeedersModule } from '../database/seeders/seeders.module';
import { SeedService } from '../database/seeders/seed/seed.service';
import { TravelsModule } from '../travels/travels.module';
import { ToursModule } from '../tours/tours.module';
import databaseConfig from '../config/database.config';
import authConfig from '../config/auth.config';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV !== 'test' ? '.env' : '.env.test',
      load: [databaseConfig, authConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [databaseConfig.KEY],
      useFactory: async (dbConfig: ConfigType<typeof databaseConfig>) =>
        dbConfig as DataSourceOptions,
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    SeedersModule,
    TravelsModule,
    ToursModule,
  ],
})
export class AppModule {
  constructor(private readonly seedService: SeedService) {}

  async onApplicationBootstrap() {
    if (process.env.NODE_ENV !== 'test') {
      await this.seedService.seed();
    }
  }
}
