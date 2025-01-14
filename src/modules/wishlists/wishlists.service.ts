import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { WishlistsRepository } from '@/modules/wishlists/wishlists.repository';
import { ProductsService } from '../products/products.service';
import { WishlistEntity } from './types';
import { ProductEntity } from '../products/types';

@Injectable()
export class WishlistsService {
  constructor(
    private readonly wishlistsRepository: WishlistsRepository,
    private readonly productsService: ProductsService,
  ) {}

  public async findByUserIdAndProductIdIfThrow(
    user_id: string,
    product_id: string,
  ) {
    const wishlist = await this.wishlistsRepository.findByUserIdAndProductId(
      user_id,
      product_id,
    );

    if (wishlist) {
      throw new HttpException(
        'User can not add a product twice to a wishlist!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async findByUserIdAndProductIdElseThrow(
    user_id: string,
    product_id: string,
  ): Promise<WishlistEntity> {
    const wishlist = await this.wishlistsRepository.findByUserIdAndProductId(
      user_id,
      product_id,
    );

    if (!wishlist) {
      throw new HttpException(
        'Wishlist item with this id does not exists!',
        HttpStatus.BAD_REQUEST,
      );
    }

    return wishlist;
  }

  public async create(user_id: string, data: CreateWishlistDto): Promise<void> {
    const product = await this.productsService.findByIdElseThrow(
      data.product_id,
    );

    await this.findByUserIdAndProductIdIfThrow(user_id, data.product_id);

    if (product.user_id === user_id) {
      throw new HttpException(
        'User can not add their own products to a wishlists',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.wishlistsRepository.create(user_id, data.product_id);
  }

  public async findAll(user_id: string): Promise<ProductEntity[]> {
    return await this.wishlistsRepository.findAllByUserId(user_id);
  }

  public async remove(user_id: string, product_id: string): Promise<void> {
    const wishlist = await this.findByUserIdAndProductIdElseThrow(
      user_id,
      product_id,
    );

    if (wishlist.user_id !== user_id) {
      throw new HttpException(
        'Users can only remove products from their own wishlist!',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.wishlistsRepository.delete(user_id, product_id);
  }
}
