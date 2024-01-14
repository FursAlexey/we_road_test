import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { datasourceConfig } from '../database/datasource';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
    }),
    TypeOrmModule.forRoot(datasourceConfig),
    UsersModule,
    RolesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
