import { Module } from '@nestjs/common';

import { ProductsImagesService } from './products_images.service';
import { ProductImagesRepository } from './product-images.repository';

@Module({
  providers: [ProductsImagesService, ProductImagesRepository],
  exports: [ProductsImagesService, ProductImagesRepository],
})
export class ProductsImagesModule {}
