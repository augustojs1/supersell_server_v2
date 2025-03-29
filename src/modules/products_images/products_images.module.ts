import { forwardRef, Module } from '@nestjs/common';

import { ProductsImagesService } from './products_images.service';
import { ProductImagesRepository } from './product-images.repository';
import { ProductsModule } from '../products/products.module';
import { AwsS3StorageService } from '@/infra/storage/impl/aws-s3-storage.service';

@Module({
  providers: [
    ProductsImagesService,
    ProductImagesRepository,
    AwsS3StorageService,
  ],
  imports: [forwardRef(() => ProductsModule)],
  exports: [ProductsImagesService, ProductImagesRepository],
})
export class ProductsImagesModule {}
