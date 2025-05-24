import { forwardRef, Module } from '@nestjs/common';

import { ProductsImagesService } from './products_images.service';
import { ProductImagesRepository } from './product-images.repository';
import { ProductsModule } from '../products/products.module';
import { AwsS3StorageService } from '@/infra/storage/impl/aws-s3-storage.service';
import { IStorageService } from '@/infra/storage/istorage.service.interface';
import { DiskStorageService } from '@/infra/storage/impl/disk-storage.service';
import { configuration } from '@/infra/config/configuration';

@Module({
  providers: [
    ProductsImagesService,
    ProductImagesRepository,
    {
      provide: IStorageService,
      useClass:
        configuration().NODE_ENV === 'development'
          ? DiskStorageService
          : AwsS3StorageService,
    },
  ],
  imports: [forwardRef(() => ProductsModule)],
  exports: [ProductsImagesService, ProductImagesRepository],
})
export class ProductsImagesModule {}
