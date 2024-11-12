import { forwardRef, Module } from '@nestjs/common';

import { ProductsImagesService } from './products_images.service';
import { ProductImagesRepository } from './product-images.repository';
import { ProductsModule } from '../products/products.module';

@Module({
  providers: [ProductsImagesService, ProductImagesRepository],
  imports: [forwardRef(() => ProductsModule)],
  exports: [ProductsImagesService, ProductImagesRepository],
})
export class ProductsImagesModule {}
