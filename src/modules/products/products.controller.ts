import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto';
import { AccessTokenGuard } from '../auth/guards';
import { GetCurrentUserDecorator } from '../auth/decorators';
import { CurrentUser } from '../auth/types';
import { ProductEntity } from './types';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  public async create(
    @Body() data: CreateProductDto,
    @GetCurrentUserDecorator() user: CurrentUser,
  ): Promise<ProductEntity> {
    return await this.productsService.create(user.sub, data);
  }
}
