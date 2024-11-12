import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { File, FilesInterceptor } from '@nest-lab/fastify-multer';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto';
import { AccessTokenGuard } from '../auth/guards';
import { GetCurrentUserDecorator } from '../auth/decorators';
import { CurrentUser } from '../auth/types';
import { ProductsImagesService } from '../products_images/products_images.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly productsImagesService: ProductsImagesService,
  ) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('image'))
  public async create(
    @Body() data: CreateProductDto,
    @GetCurrentUserDecorator() user: CurrentUser,
    @UploadedFiles(
      new ParseFilePipeBuilder().build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    product_images: File[],
  ): Promise<any> {
    return await this.productsService.create(user.sub, data, product_images);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/product-image/:product_image_id')
  public async deleteProductImage(
    @Param('product_image_id') product_image_id: string,
    @GetCurrentUserDecorator() user: CurrentUser,
  ): Promise<void> {
    await this.productsImagesService.delete(user.sub, product_image_id);
  }
}
