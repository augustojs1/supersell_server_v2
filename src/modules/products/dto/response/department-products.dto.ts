import { ProductEntity } from '../../types';

export class DepartmentProductsDTO {
  data: ProductEntity[];
  meta: {
    page: number;
    size: number;
    count: number;
    numberOfPages: number;
  };
}
