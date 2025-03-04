import { forwardRef, Module } from '@nestjs/common';

import { DrizzleModule } from '@/infra/database/orm/drizzle/drizzle.module';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';
import { DepartmentsRepository } from './departments.repository';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';

@Module({
  controllers: [DepartmentsController],
  providers: [DepartmentsService, DepartmentsRepository],
  imports: [
    DrizzleModule,
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
    forwardRef(() => ProductsModule),
  ],
  exports: [DepartmentsService],
})
export class DepartmentsModule {}
