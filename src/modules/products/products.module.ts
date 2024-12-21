import { forwardRef, Module } from '@nestjs/common';
import { FastifyMulterModule } from '@nest-lab/fastify-multer';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './products.repository';
import { AuthModule } from '../auth/auth.module';
import { DepartmentsModule } from '../departments/departments.module';
import { DiskStorageService } from '@/infra/storage/disk-storage.service';
import { ProductsImagesModule } from '../products_images/products_images.module';

const DISK_STORAGE_PATH = './.temp/uploads/products';

@Module({
  controllers: [ProductsController],
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => DepartmentsModule),
    FastifyMulterModule.register({
      storage: new DiskStorageService(DISK_STORAGE_PATH),
    }),
    forwardRef(() => ProductsImagesModule),
  ],
  providers: [ProductsService, ProductsRepository],
  exports: [ProductsService, ProductsRepository],
})
export class ProductsModule {}
