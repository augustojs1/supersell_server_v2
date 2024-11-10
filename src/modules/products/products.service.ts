import {
  HttpException,
  HttpStatus,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { File } from '@nest-lab/fastify-multer';

import { ProductsRepository } from './products.repository';
import { CreateProductDto } from './dto';
import { ProductEntity } from './types';
import { DepartmentsService } from '../departments/departments.service';
import { AccessTokenGuard } from '../auth/guards';
import { ProductsImagesService } from '../products_images/products_images.service';

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
    product_images: File[],
  ): Promise<ProductEntity> {
    const product = await this.productsRepository.findByName(data.name);

    if (product) {
      throw new HttpException(
        'Product with this name already exists!',
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

    const createdProduct = await this.productsRepository.create(user_id, data);

    await this.productImagesService.create(createdProduct.id, product_images);

    return createdProduct;
  }

  public async findByDepartmentId(
    department_id: string,
  ): Promise<ProductEntity[]> {
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
      );
    }

    return await this.productsRepository.findByDepartmentId(department_id);
  }
}
