import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { DepartmentsService } from './departments.service';
import { GetCurrentUserDecorator } from '../auth/decorators';
import { CurrentUser } from '../auth/types';
import {
  CreateDepartmentDto,
  DepartmentDto,
  UpdateDepartmentDto,
} from './dtos';
import { AccessTokenGuard, AdminGuard } from '../auth/guards';
import { ProductsService } from '../products/products.service';
import { ProductEntity } from '../products/types';
import { PaginationParamsDto } from '@/common/dto';

@Controller('departments')
export class DepartmentsController {
  constructor(
    private readonly departmentsService: DepartmentsService,
    private readonly productsService: ProductsService,
  ) {}

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Post()
  public async create(@Body() data: CreateDepartmentDto) {
    return await this.departmentsService.create(data);
  }

  @Get()
  public async getParentDepartments(): Promise<DepartmentDto[]> {
    return await this.departmentsService.findParentDepartments();
  }

  @Get(':parent_id/children')
  public async getChildrenDepartments(
    @GetCurrentUserDecorator() user: CurrentUser,
    @Param('parent_id') parent_id: string,
  ): Promise<DepartmentDto[]> {
    return await this.departmentsService.findChildrenDepartments(parent_id);
  }

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() data: UpdateDepartmentDto,
  ): Promise<void> {
    return await this.departmentsService.update(id, data);
  }

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<void> {
    return await this.departmentsService.delete(id);
  }

  @Get(':department_id/products')
  public async getProductByDepartmentId(
    @Param('department_id') department_id: string,
    @Query() paginationParams: PaginationParamsDto,
  ): Promise<ProductEntity[]> {
    const { page, size, orderBy } = paginationParams;

    return await this.productsService.findByDepartmentId(department_id, {
      page: Number(page),
      size: Number(size),
      orderBy,
    });
  }
}
