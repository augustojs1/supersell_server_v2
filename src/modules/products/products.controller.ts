import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { File, FileFieldsInterceptor } from '@nest-lab/fastify-multer';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ProductsService } from './products.service';
import { CreateProductDto, ProductDTO, UpdateProductDto } from './dto';
import { AccessTokenGuard } from '../auth/guards';
import { GetCurrentUserDecorator } from '../auth/decorators';
import { CurrentUser } from '../auth/types';
import { ProductsImagesService } from '../products_images/products_images.service';
import { ProductImages } from './types/product-images.type';
import { ProductsTextResultDto } from './dto/response/products-text-result.dto';
import { FileDto } from '@/modules/common/dto';
import { ImageFieldsValidatorInterceptor } from '@/infra/interceptors';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly productsImagesService: ProductsImagesService,
  ) {}

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product successfully created!' })
  @ApiResponse({
    status: 400,
    description: `
      - Product with this name already exists!
      - Product with this SKU already exists!
      - Department with this id does not exists!
      - Product can not be related to a parent department!
    `,
  })
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail_image', maxCount: 1 },
      { name: 'images', maxCount: 8 },
    ]),
    new ImageFieldsValidatorInterceptor(['thumbnail_image', 'images']),
  )
  public async create(
    @Body() data: CreateProductDto,
    @GetCurrentUserDecorator() user: CurrentUser,
    @UploadedFiles()
    files: ProductImages,
  ): Promise<any> {
    return await this.productsService.create(user.sub, data, files);
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a image from a product' })
  @ApiParam({
    name: 'product_image_id',
    description: 'Id of the image to be removed from the product.',
    allowEmptyValue: false,
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Product image successfully removed!',
  })
  @ApiResponse({
    status: 400,
    description: `
      - Product image with this id does not exists!
      - Product with this SKU already exists!
      - Department with this id does not exists!
      - Product can not be related to a parent department!
    `,
  })
  @ApiResponse({
    status: 403,
    description: 'User can not delete this product image!',
  })
  @Delete('/product-image/:product_image_id')
  public async deleteProductImage(
    @Param('product_image_id') product_image_id: string,
    @GetCurrentUserDecorator() user: CurrentUser,
  ): Promise<void> {
    await this.productsImagesService.delete(user.sub, product_image_id);
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add an image to an owned product' })
  @ApiParam({
    name: 'product_id',
    description: 'Id of the image to be removed from the product.',
    allowEmptyValue: false,
    required: true,
    example: '1',
  })
  @ApiCreatedResponse({
    description: 'Product image succesfully created!',
    type: FileDto,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized!',
  })
  @ApiResponse({
    status: 400,
    description: 'Product with this id does not exists!',
  })
  @ApiResponse({
    status: 422,
    description: `Product image with this id does not exists!
    `,
  })
  @ApiResponse({
    status: 403,
    description: 'User does not own this product',
  })
  @Post(':product_id/images')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'image', maxCount: 6 }]),
    new ImageFieldsValidatorInterceptor(['image']),
  )
  public async uploadImages(
    @Param('product_id') product_id: string,
    @GetCurrentUserDecorator() user: CurrentUser,
    @UploadedFiles()
    product_images: File[],
  ): Promise<FileDto[]> {
    return await this.productsService.addImages(
      user.sub,
      product_id,
      product_images,
    );
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({
    name: 'product_id',
    description: 'Id of the product to be edited',
    allowEmptyValue: false,
    required: true,
  })
  @ApiCreatedResponse({
    description: 'Product succesfully updated!',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized!',
  })
  @ApiResponse({
    status: 400,
    description: 'Product with this id does not exists!',
  })
  @ApiResponse({
    status: 403,
    description: 'User does not own this product.',
  })
  @Patch(':product_id')
  public async updateProduct(
    @Param('product_id') product_id: string,
    @GetCurrentUserDecorator() user: CurrentUser,
    @Body() data: UpdateProductDto,
  ) {
    return await this.productsService.updateProduct(user.sub, product_id, data);
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({
    name: 'product_id',
    description: 'Id of the product to be deleted',
    allowEmptyValue: false,
    required: true,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized!',
  })
  @ApiResponse({
    status: 400,
    description: 'Product with this id does not exists!',
  })
  @ApiResponse({
    status: 403,
    description: 'User does not own this product.',
  })
  @Delete(':product_id')
  public async delete(
    @Param('product_id') product_id: string,
    @GetCurrentUserDecorator() user: CurrentUser,
  ) {
    return await this.productsService.delete(user.sub, product_id);
  }

  @ApiOperation({ summary: 'Search products by name' })
  @ApiParam({
    name: 'name',
    description: 'Name of product to search',
    allowEmptyValue: false,
    required: true,
  })
  @Get()
  public async getProductByName(
    @Query('name') name: string,
  ): Promise<ProductsTextResultDto[]> {
    return await this.productsService.findByName(name);
  }

  @ApiOperation({ summary: 'Get a product by id' })
  @ApiParam({
    name: 'product_id',
    description: 'Id of the product to returned',
    allowEmptyValue: false,
    required: true,
  })
  @ApiResponse({
    status: 400,
    description: 'Product with this id does not exists!',
  })
  @Get(':product_id')
  public async getById(
    @Param('product_id') product_id: string,
  ): Promise<ProductDTO> {
    return await this.productsService.findByIdWithImages(product_id);
  }
}
