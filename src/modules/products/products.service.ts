import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { ProductsRepository } from './products.repository';
import { CreateProductDto } from './dto';
import { ProductEntity } from './types';
import { DepartmentsService } from '../departments/departments.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly departmentsService: DepartmentsService,
  ) {}

  public async create(
    user_id: string,
    data: CreateProductDto,
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

    if (data.quantity === 0) {
      throw new HttpException('Quantity can not be 0!', HttpStatus.BAD_REQUEST);
    }

    if (data.price === 0) {
      throw new HttpException('Price can not be 0!', HttpStatus.BAD_REQUEST);
    }

    return await this.productsRepository.create(user_id, data);
  }
}
