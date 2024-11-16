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

@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  public async create(
    @GetCurrentUserDecorator() user: CurrentUser,
    @Body() createWishlistDto: CreateWishlistDto,
  ): Promise<void> {
    return this.wishlistsService.create(user.sub, createWishlistDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  public async findAll(@GetCurrentUserDecorator() user: CurrentUser) {
    return this.wishlistsService.findAll(user.sub);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('products/:product_id')
  public async remove(
    @Param('product_id') product_id: string,
    @GetCurrentUserDecorator() user: CurrentUser,
  ): Promise<void> {
    return await this.wishlistsService.remove(user.sub, product_id);
  }
}
