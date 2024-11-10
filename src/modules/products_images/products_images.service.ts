import { Injectable } from '@nestjs/common';

import { ProductImagesRepository } from './product-images.repository';
import { ProductImagesEntity } from './types/product-images-entity.type';
import { ulid } from 'ulid';
import { File } from '@nest-lab/fastify-multer';

@Injectable()
export class ProductsImagesService {
  constructor(
    private readonly productImagesRepository: ProductImagesRepository,
  ) {}

  public async create(product_id: string, images: File[]) {
    const productImages: ProductImagesEntity[] = images.map((image) => {
      return {
        id: ulid(),
        product_id: product_id,
        url: image.path,
      };
    });

    console.log('productImages::', productImages);

    const createdProductImages =
      await this.productImagesRepository.create(productImages);

    console.log('create product images::', createdProductImages);

    return createdProductImages;
  }
}
