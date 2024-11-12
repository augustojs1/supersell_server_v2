import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { File } from '@nest-lab/fastify-multer';
import { ulid } from 'ulid';

import { ProductImagesRepository } from './product-images.repository';
import { ProductImagesEntity } from './types/product-images-entity.type';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ProductsImagesService {
  constructor(
    private readonly productImagesRepository: ProductImagesRepository,
    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,
  ) {}

  public async create(product_id: string, images: File[]) {
    const productImages: ProductImagesEntity[] = images.map((image) => {
      return {
        id: ulid(),
        product_id: product_id,
        url: image.path,
      };
    });

    const createdProductImages =
      await this.productImagesRepository.create(productImages);

    return createdProductImages;
  }

  public async delete(
    user_id: string,
    product_image_id: string,
  ): Promise<void> {
    const productImage =
      await this.productImagesRepository.findById(product_image_id);

    if (!productImage) {
      throw new HttpException(
        'Product image with this id does not exists!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const product = await this.productsService.findById(
      productImage.product_id,
    );

    if (product.user_id !== user_id) {
      throw new HttpException(
        'User can not delete this product image!',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.productImagesRepository.delete(product_image_id);
  }
}
