import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ShoppingCartsService } from './shopping_carts.service';
import { AccessTokenGuard } from '../auth/guards';
import { GetCurrentUserDecorator } from '../auth/decorators';
import { CurrentUser } from '../auth/types';
import { CreateShoppingCartItemDto } from './dto';
// import { UpdateShoppingCartDto } from './dto/update-shopping_cart.dto';

@Controller('shopping-carts')
export class ShoppingCartsController {
  constructor(private readonly shoppingCartsService: ShoppingCartsService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  public async create(
    @GetCurrentUserDecorator() user: CurrentUser,
  ): Promise<void> {
    await this.shoppingCartsService.create(user.sub);
  }

  @UseGuards(AccessTokenGuard)
  @Post('/item')
  public async createItem(
    @Body() data: CreateShoppingCartItemDto,
    @GetCurrentUserDecorator() user: CurrentUser,
  ): Promise<any> {
    return await this.shoppingCartsService.createShoppingCartItem(
      user.sub,
      data.product_id,
    );
  }

  @Get()
  public async findAll() {
    return this.shoppingCartsService.findAll();
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateShoppingCartDto: UpdateShoppingCartDto) {
  //   return this.shoppingCartsService.update(+id, updateShoppingCartDto);
  // }

  @UseGuards(AccessTokenGuard)
  @Delete('/item/product/:product_id')
  public async remove(
    @Param('product_id') product_id: string,
    @GetCurrentUserDecorator() user: CurrentUser,
  ) {
    return await this.shoppingCartsService.remove(user.sub, product_id);
  }
}
