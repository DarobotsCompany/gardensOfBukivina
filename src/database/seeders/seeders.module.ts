import { Module } from '@nestjs/common';
import { SeedAdminModule } from './seed-admin/seed-admin.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConfig } from '../config';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    TypeOrmModule.forRoot(getConfig()),
    SeedAdminModule
  ],
  controllers: [],
  providers: [],
})
export class SeedersModule {}
