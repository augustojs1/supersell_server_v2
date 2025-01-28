import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { AccessTokenGuard } from '../auth/guards';
import { CurrentUser } from '../auth/types';
import { GetCurrentUserDecorator } from '../auth/decorators';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { ProductEntity } from '../products/types';

@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @ApiOperation({
    summary: 'Add product to user wishlist.',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Succesfully add product to wishlist!',
  })
  @ApiResponse({
    status: 403,
    description: `User can not add their own products to a wishlists!
      `,
  })
  @ApiResponse({
    status: 404,
    description: `Product with this id does not exists!
      `,
  })
  @UseGuards(AccessTokenGuard)
  @Post()
  public async create(
    @GetCurrentUserDecorator() user: CurrentUser,
    @Body() createWishlistDto: CreateWishlistDto,
  ): Promise<void> {
    return this.wishlistsService.create(user.sub, createWishlistDto);
  }

  @ApiOperation({
    summary: 'Read all authenticated user wishlisted products.',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Succesfully read all authenticated user wishlisted products.',
    type: ProductEntity,
    isArray: true,
  })
  @UseGuards(AccessTokenGuard)
  @Get()
  public async findAll(
    @GetCurrentUserDecorator() user: CurrentUser,
  ): Promise<ProductEntity[]> {
    return this.wishlistsService.findAll(user.sub);
  }

  @ApiOperation({
    summary: 'Remove a wishlisted product.',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Succesfully remove product from wishlist!',
  })
  @ApiResponse({
    status: 403,
    description: `Users can only remove products from their own wishlist!
      `,
  })
  @ApiResponse({
    status: 404,
    description: `Product with this id does not exists!
      `,
  })
  @UseGuards(AccessTokenGuard)
  @Delete('products/:product_id')
  public async remove(
    @Param('product_id') product_id: string,
    @GetCurrentUserDecorator() user: CurrentUser,
  ): Promise<void> {
    return await this.wishlistsService.remove(user.sub, product_id);
  }
}
