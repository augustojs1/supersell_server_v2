import { forwardRef, Module } from '@nestjs/common';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './products.repository';
import { AuthModule } from '../auth/auth.module';
import { DepartmentsModule } from '../departments/departments.module';

@Module({
  controllers: [ProductsController],
  imports: [AuthModule, forwardRef(() => DepartmentsModule)],
  providers: [ProductsService, ProductsRepository],
  exports: [ProductsService, ProductsRepository],
})
export class ProductsModule {}
