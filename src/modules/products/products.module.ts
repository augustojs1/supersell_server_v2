import { Module } from '@nestjs/common';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './products.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ProductsController],
  imports: [AuthModule],
  providers: [ProductsService, ProductsRepository],
})
export class ProductsModule {}
