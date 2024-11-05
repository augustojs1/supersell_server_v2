import { Module } from '@nestjs/common';

import { DrizzleModule } from '@/infra/database/orm/drizzle/drizzle.module';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';
import { DepartmentsRepository } from './departments.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [DepartmentsController],
  providers: [DepartmentsService, DepartmentsRepository],
  imports: [DrizzleModule, AuthModule],
})
export class DepartmentsModule {}
