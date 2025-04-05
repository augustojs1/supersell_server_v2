import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { File } from '@nest-lab/fastify-multer';
import { ulid } from 'ulid';

import { ProductImagesRepository } from './product-images.repository';
import { ProductImagesEntity } from './types/product-images-entity.type';
import { ProductsService } from '../products/products.service';
import { IStorageService } from '@/infra/storage/istorage.service.interface';

@Injectable()
export class ProductsImagesService {
  private logger: Logger = new Logger(ProductsImagesService.name);

  constructor(
    private readonly productImagesRepository: ProductImagesRepository,
    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,
    private readonly storageService: IStorageService,
  ) {}

  public async create(user_id: string, product_id: string, images: any) {
    this.logger.log(`Init uploading images to product ${product_id}`);
    const productImages: ProductImagesEntity[] = [];

    for (const image of images.image) {
      const s3Data = await this.storageService.upload(
        image,
        `user_${user_id}/products/product_${product_id}/images`,
      );

      productImages.push({
        id: ulid(),
        product_id: product_id,
        url: s3Data.Location,
      });
    }

    await this.productImagesRepository.create(productImages);

    this.logger.log(`SUCCESS uploading images to product ${product_id}`);

    return productImages;
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

    const avatarKey = productImage.url.split('.com/')[1];

    if (avatarKey) {
      await this.storageService.remove(avatarKey);
      return await this.productImagesRepository.delete(product_image_id);
    }

    await this.storageService.remove(productImage.url);

    return await this.productImagesRepository.delete(product_image_id);
  }
}
