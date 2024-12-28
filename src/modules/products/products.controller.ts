import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  File,
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nest-lab/fastify-multer';

import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { AccessTokenGuard } from '../auth/guards';
import { GetCurrentUserDecorator } from '../auth/decorators';
import { CurrentUser } from '../auth/types';
import { ProductsImagesService } from '../products_images/products_images.service';
import { ProductImages } from './types/product-images.type';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly productsImagesService: ProductsImagesService,
  ) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail_image', maxCount: 1 },
      { name: 'images', maxCount: 8 },
    ]),
  )
  public async create(
    @Body() data: CreateProductDto,
    @GetCurrentUserDecorator() user: CurrentUser,
    @UploadedFiles(
      new ParseFilePipeBuilder().build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    files: ProductImages,
  ): Promise<any> {
    return await this.productsService.create(user.sub, data, files);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/product-image/:product_image_id')
  public async deleteProductImage(
    @Param('product_image_id') product_image_id: string,
    @GetCurrentUserDecorator() user: CurrentUser,
  ): Promise<void> {
    await this.productsImagesService.delete(user.sub, product_image_id);
  }

  @UseGuards(AccessTokenGuard)
  @Post(':product_id/images')
  @UseInterceptors(FilesInterceptor('image'))
  public async uploadImages(
    @Param('product_id') product_id: string,
    @GetCurrentUserDecorator() user: CurrentUser,
    @UploadedFiles(
      new ParseFilePipeBuilder().build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    product_images: File[],
  ): Promise<File[]> {
    return await this.productsService.addImages(
      user.sub,
      product_id,
      product_images,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':product_id')
  public async updateProduct(
    @Param('product_id') product_id: string,
    @GetCurrentUserDecorator() user: CurrentUser,
    @Body() data: UpdateProductDto,
  ) {
    return await this.productsService.updateProduct(user.sub, product_id, data);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':product_id')
  public async delete(
    @Param('product_id') product_id: string,
    @GetCurrentUserDecorator() user: CurrentUser,
  ) {
    return await this.productsService.delete(user.sub, product_id);
  }

  @Get()
  public async getProductByName(@Query('name') name: string) {
    return await this.productsService.findByName(name);
  }
}
