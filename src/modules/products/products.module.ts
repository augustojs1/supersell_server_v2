import { forwardRef, Module } from '@nestjs/common';
import { FastifyMulterModule } from '@nest-lab/fastify-multer';
import * as multer from 'fastify-multer';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './products.repository';
import { AuthModule } from '../auth/auth.module';
import { DepartmentsModule } from '../departments/departments.module';
import { ProductsImagesModule } from '../products_images/products_images.module';
import { CommonModule } from '@/modules/common/common.module';
import { SlugProvider } from './providers/slug.provider';
import { AwsS3StorageService } from '@/infra/storage/impl/aws-s3-storage.service';
import { IStorageService } from '@/infra/storage/istorage.service.interface';
import { configuration } from '@/infra/config/configuration';
import { DiskStorageService } from '@/infra/storage/impl/disk-storage.service';

@Module({
  controllers: [ProductsController],
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => DepartmentsModule),
    FastifyMulterModule.register({
      storage: multer.memoryStorage(),
    }),
    forwardRef(() => ProductsImagesModule),
    CommonModule,
  ],
  providers: [
    ProductsService,
    ProductsRepository,
    SlugProvider,
    {
      provide: IStorageService,
      useClass:
        configuration().NODE_ENV === 'dev'
          ? DiskStorageService
          : AwsS3StorageService,
    },
  ],
  exports: [ProductsService, ProductsRepository],
})
export class ProductsModule {}
