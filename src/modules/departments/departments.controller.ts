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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

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
import { PaginationParamsSortableDto } from '@/modules/common/dto';
import { DepartmentProductsDTO } from '../products/dto';

@Controller('departments')
export class DepartmentsController {
  constructor(
    private readonly departmentsService: DepartmentsService,
    private readonly productsService: ProductsService,
  ) {}

  @UseGuards(AccessTokenGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '(Admin) Create a new department.' })
  @ApiResponse({
    status: 201,
    description: 'Succesfully created a new department.',
  })
  @ApiResponse({
    status: 400,
    description: `
      - Department with this name already exists!
      - Parent department does not exists!
      - This department already have a parent!
    `,
  })
  @Post()
  public async create(@Body() data: CreateDepartmentDto) {
    return await this.departmentsService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Read all parent departments.' })
  @ApiResponse({
    status: 200,
    description: 'Succesfully read all parent departments',
  })
  public async getParentDepartments(): Promise<DepartmentDto[]> {
    return await this.departmentsService.findParentDepartments();
  }

  @Get(':parent_id/children')
  @ApiOperation({
    summary: 'Read all children departments from a parent department id.',
  })
  @ApiParam({
    name: 'parent_id',
    description: 'Id of parent department',
    allowEmptyValue: false,
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Succesfully read all children departments.',
  })
  @ApiResponse({
    status: 400,
    description: 'Parent department with this id does not exists!',
  })
  public async getChildrenDepartments(
    @GetCurrentUserDecorator() user: CurrentUser,
    @Param('parent_id') parent_id: string,
  ): Promise<DepartmentDto[]> {
    return await this.departmentsService.findChildrenDepartments(parent_id);
  }

  @UseGuards(AccessTokenGuard, AdminGuard)
  @ApiOperation({
    summary: '(Admin) Update a department.',
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Id of department to be updated',
    allowEmptyValue: false,
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Succesfully updated a product!',
  })
  @ApiResponse({
    status: 400,
    description: `Department with this id does not exists!
    `,
  })
  @ApiResponse({
    status: 404,
    description: 'Department with this id does not exists!',
  })
  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() data: UpdateDepartmentDto,
  ): Promise<void> {
    return await this.departmentsService.update(id, data);
  }

  @UseGuards(AccessTokenGuard, AdminGuard)
  @ApiOperation({
    summary: '(Admin) Delete a department.',
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Id of department to be delete',
    allowEmptyValue: false,
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Succesfully deleted a department',
  })
  @ApiResponse({
    status: 404,
    description: 'Department with this id does not exists!',
  })
  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<void> {
    return await this.departmentsService.delete(id);
  }

  @ApiOperation({
    summary: 'Return all products from the department id.',
  })
  @ApiParam({
    name: 'id',
    description: 'Id of products department',
    allowEmptyValue: false,
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Succesfully read all products from department id!',
  })
  @ApiResponse({
    status: 404,
    description: 'Department with this id does not exists',
  })
  @Get(':department_id/products')
  public async getProductByDepartmentId(
    @Param('department_id') department_id: string,
    @Query() paginationParams: PaginationParamsSortableDto,
  ): Promise<DepartmentProductsDTO> {
    const { page, size, orderBy } = paginationParams;

    return await this.productsService.findByDepartmentId(department_id, {
      page: Number(page),
      size: Number(size),
      orderBy,
    });
  }
}
