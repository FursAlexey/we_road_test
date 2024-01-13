import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { datasourceConfig } from '../database/datasource';

@Module({
  imports: [TypeOrmModule.forRoot(datasourceConfig)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
