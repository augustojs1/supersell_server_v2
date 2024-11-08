import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { CreateProductDto } from './dto';
import { ProductEntity } from './types';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  public async create(
    user_id: string,
    data: CreateProductDto,
  ): Promise<ProductEntity> {
    // check if product with the same name exists
    // check if department exists
    // check if it isnt a department with no parent department
    // check if quantity is not zero
    // check if price is not zero

    return await this.productsRepository.create(user_id, data);
  }
}
