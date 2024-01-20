import { Module } from '@nestjs/common';
import { TestingService } from './testing/testing.service';
import { SeedersModule } from '../database/seeders/seeders.module';

@Module({
  imports: [SeedersModule],
  providers: [TestingService],
})
export class TestingModule {}
