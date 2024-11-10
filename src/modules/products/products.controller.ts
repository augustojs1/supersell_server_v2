import {
  Body,
  Controller,
  HttpStatus,
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

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

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
}
