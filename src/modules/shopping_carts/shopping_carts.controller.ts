import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ShoppingCartsService } from './shopping_carts.service';
import { AccessTokenGuard } from '../auth/guards';
import { GetCurrentUserDecorator } from '../auth/decorators';
import { CurrentUser } from '../auth/types';
import {
  CheckoutOrderDTO,
  CreateShoppingCartItemDto,
  ShoppingCartItemsDTO,
  UpdateItemQuantityDTO,
} from './dto';

@ApiTags('Shopping Carts')
@Controller('shopping-carts')
export class ShoppingCartsController {
  constructor(private readonly shoppingCartsService: ShoppingCartsService) {}

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add product to shopping cart.' })
  @ApiResponse({
    status: 201,
    description: 'Product successfully added to shopping cart!',
  })
  @ApiResponse({
    status: 400,
    description: `
      - Product with this id does not exists!
      - User shopping cart does not exists!
      - Product is out of stock!
      - Product is already in user shopping list!
    `,
  })
  @ApiResponse({
    status: 403,
    description: `
      - Users can not add their own products to a shopping cart
    `,
  })
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

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Read all products in the shopping cart.' })
  @ApiResponse({
    status: 200,
    description: 'Shopping cart items succesfully returned',
  })
  @ApiResponse({
    status: 404,
    description: `
      - Product with this id not found on user shopping cart!
      - User shopping cart does not exists!
    `,
  })
  @ApiResponse({
    status: 400,
    description: `
      - Quantity not available!
    `,
  })
  @Get()
  public async findAll(
    @GetCurrentUserDecorator() user: CurrentUser,
  ): Promise<ShoppingCartItemsDTO[]> {
    return await this.shoppingCartsService.findAll(user.sub);
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update shopping cart item quantity.' })
  @ApiParam({
    name: 'product_id',
    description: 'Id of product to in shopping cart to update quantity.',
    allowEmptyValue: false,
    required: true,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Succesfully updated shopping cart item quantity',
  })
  @Patch('/item/product/:product_id')
  update(
    @Param('product_id') product_id: string,
    @GetCurrentUserDecorator() user: CurrentUser,
    @Body() data: UpdateItemQuantityDTO,
  ) {
    return this.shoppingCartsService.update(
      user.sub,
      product_id,
      data.quantity,
    );
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove shopping cart item.' })
  @ApiParam({
    name: 'product_id',
    description: 'Id of product to remove from shopping cart.',
    allowEmptyValue: false,
    required: true,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Succesfully removed shopping cart item',
  })
  @ApiResponse({
    status: 404,
    description: 'Product with this id not found on user shopping cart!',
  })
  @Delete('/item/product/:product_id')
  public async remove(
    @Param('product_id') product_id: string,
    @GetCurrentUserDecorator() user: CurrentUser,
  ) {
    return await this.shoppingCartsService.remove(user.sub, product_id);
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create order with items from shopping cart.' })
  @ApiParam({
    name: 'product_id',
    description: 'Id of product to remove from shopping cart.',
    allowEmptyValue: false,
    required: true,
    example: 1,
  })
  @ApiResponse({
    status: 201,
    description: 'Succesfully created orders from shopping cart items',
  })
  @ApiResponse({
    status: 400,
    description:
      'An error occured when trying to create order from shopping cart item',
  })
  @Post('/checkout')
  public async checkout(
    @GetCurrentUserDecorator() user: CurrentUser,
    @Body() dto: CheckoutOrderDTO,
  ) {
    return await this.shoppingCartsService.checkout(user.sub, dto);
  }
}
