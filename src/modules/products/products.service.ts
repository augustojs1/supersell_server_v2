import {
  HttpException,
  HttpStatus,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { File } from '@nest-lab/fastify-multer';

import { ProductsRepository } from './products.repository';
import {
  CreateProductDto,
  DepartmentProductsDTO,
  ProductDTO,
  UpdateProductDto,
} from './dto';
import { ProductEntity } from './types';
import { DepartmentsService } from '../departments/departments.service';
import { AccessTokenGuard } from '../auth/guards';
import { ProductsImagesService } from '../products_images/products_images.service';
import { ProductImages } from './types/product-images.type';
import {
  PaginationParamsDto,
  PaginationParamsSortableDto,
} from '@/modules/common/dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly productImagesService: ProductsImagesService,
    private readonly departmentsService: DepartmentsService,
  ) {}

  @UseGuards(AccessTokenGuard)
  public async create(
    user_id: string,
    data: CreateProductDto,
    product_images: ProductImages,
  ): Promise<ProductEntity> {
    const product = await this.productsRepository.findByName(data.name);

    if (product) {
      throw new HttpException(
        'Product with this name already exists!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const productSku = await this.productsRepository.findBySkuAndUserId(
      data.sku,
      user_id,
    );

    if (productSku) {
      throw new HttpException(
        'Product with this SKU already exists!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const department = await this.departmentsService.findById(
      data.department_id,
    );

    if (!department) {
      throw new HttpException(
        'Department with this id does not exists!',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!department.parent_department_id) {
      throw new HttpException(
        'Product can not be related to a parent department!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const createdProduct = await this.productsRepository.create(
      user_id,
      data,
      product_images.thumbnail_image[0].path,
    );

    await this.productImagesService.create(
      createdProduct.id,
      product_images.images,
    );

    return createdProduct;
  }

  public async findByDepartmentId(
    department_id: string,
    paginationParams: PaginationParamsSortableDto,
  ): Promise<any> {
    const department = await this.departmentsService.findById(department_id);

    if (!department) {
      throw new HttpException(
        'Department with this id does not exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!department.parent_department_id) {
      return await this.productsRepository.findByParentDepartmentId(
        department_id,
        paginationParams,
      );
    }

    return await this.productsRepository.findByDepartmentId(
      department_id,
      paginationParams,
    );
  }

  public async findUserProducts(
    user_id: string,
    paginationParams: PaginationParamsDto,
  ): Promise<DepartmentProductsDTO> {
    return await this.productsRepository.findByUserId(
      user_id,
      paginationParams,
    );
  }

  public async findById(id: string): Promise<ProductEntity | null> {
    return await this.productsRepository.findById(id);
  }

  public async checkProductOwnershipElseThrow(
    user_id: string,
    product_id: string,
  ): Promise<void> {
    const product = await this.findByIdElseThrow(product_id);

    if (product.user_id !== user_id) {
      throw new HttpException('Action not allowed', HttpStatus.FORBIDDEN);
    }
  }

  public async findByIdElseThrow(id: string) {
    const product = await this.findById(id);

    if (!product) {
      throw new HttpException(
        'Product with this id does not exists!',
        HttpStatus.BAD_REQUEST,
      );
    }

    return product;
  }

  public async updateProduct(
    user_id: string,
    product_id: string,
    data: UpdateProductDto,
  ): Promise<void> {
    const product = await this.findByIdElseThrow(product_id);

    await this.checkProductOwnershipElseThrow(user_id, product.id);

    await this.productsRepository.updateProduct(product.id, data);
  }

  public async delete(user_id: string, product_id: string): Promise<void> {
    const product = await this.findByIdElseThrow(product_id);

    await this.checkProductOwnershipElseThrow(user_id, product.id);

    await this.productsRepository.deleteProduct(product_id);
  }

  public async addImages(
    user_id: string,
    product_id: string,
    images: File[],
  ): Promise<File[]> {
    const product = await this.findByIdElseThrow(product_id);

    await this.checkProductOwnershipElseThrow(user_id, product.id);

    await this.productImagesService.create(product_id, images);

    return images;
  }

  public async findByName(name: string) {
    return await this.productsRepository.findAllByName(name);
  }

  public async findByIdWithImages(product_id: string): Promise<ProductDTO> {
    await this.findByIdElseThrow(product_id);

    return await this.productsRepository.findByIdWithImages(product_id);
  }

  public async updateQuantity(
    product_id: string,
    amount: number,
  ): Promise<void> {
    if (amount === 0) {
      await this.setProductIsInStock(product_id, false);
    }

    await this.productsRepository.updateQuantity(product_id, amount);
  }

  public async setProductIsInStock(product_id: string, is_in_stock: boolean) {
    await this.productsRepository.setProductIsInStock(product_id, is_in_stock);
  }
}
