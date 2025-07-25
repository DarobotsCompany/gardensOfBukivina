import { NestFactory } from '@nestjs/core';
import { SeedersModule } from './seeders.module';
import { SeedAdminService } from './seed-admin/seed-admin.service';

const runSeed = async () => {
  const app = await NestFactory.create(SeedersModule);

  await app.get(SeedAdminService).run();

  await app.close();
};

runSeed();
