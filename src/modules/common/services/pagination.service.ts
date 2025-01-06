import { Injectable } from '@nestjs/common';
import { asc, desc } from 'drizzle-orm';

import * as schema from '@/infra/database/orm/drizzle/schema';
import { PaginationParamsDto, PaginationParamsSortableDto } from '../dto';

@Injectable()
export class PaginationService {
  async paginateProducts(
    count: number,
    pagination: PaginationParamsSortableDto,
    query: any,
  ) {
    const orderBy = {
      prices_asc: asc(schema.products.price),
      prices_desc: desc(schema.products.price),
      sales_asc: asc(schema.products.sales),
      sales_desc: desc(schema.products.sales),
      date_asc: asc(schema.products.created_at),
      date_desc: desc(schema.products.created_at),
    };

    const pageSize = pagination.size ? Number(pagination.size) : 20;
    const skip = pagination.page ? (pagination.page - 1) * pageSize : 1;
    const currentPage = pagination.page ? pagination.page : 1;

    if (pagination.page) {
      query.offset(skip);
    }

    query
      .orderBy(orderBy[pagination.orderBy] ?? schema.products.name)
      .limit(pageSize);

    return {
      data: await query,
      meta: {
        page: currentPage,
        size: pageSize > count ? count : pageSize,
        count: count,
        numberOfPages: Math.ceil(count / pageSize),
      },
    };
  }

  public async paginate(
    count: number,
    pagination: PaginationParamsDto,
    query: any,
  ) {
    const pageSize = pagination.size ? Number(pagination.size) : 20;
    const skip = pagination.page ? (pagination.page - 1) * pageSize : 1;
    const currentPage = pagination.page ? pagination.page : 1;

    if (pagination.page) {
      query.offset(skip);
    }

    query.limit(pageSize);

    return {
      data: await query,
      meta: {
        page: currentPage,
        size: pageSize > count ? count : pageSize,
        count: count,
        numberOfPages: Math.ceil(count / pageSize),
      },
    };
  }
}
