import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { DepartmentsService } from './departments.service';
import { GetCurrentUserDecorator } from '../auth/decorators';
import { CurrentUser } from '../auth/types';
import { CreateDepartmentDto } from './dtos';
import { AccessTokenGuard } from '../auth/guards';
import { DepartmentEntity } from './types';

@UseGuards(AccessTokenGuard)
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  public async create(@Body() data: CreateDepartmentDto) {
    return await this.departmentsService.create(data);
  }

  @Get()
  public async getParentDepartments(): Promise<DepartmentEntity[]> {
    return await this.departmentsService.findParentDepartments();
  }

  @Get(':parent_id/children')
  public async getChildrenDepartments(
    @GetCurrentUserDecorator() user: CurrentUser,
    @Param('parent_id') parent_id: string,
  ): Promise<DepartmentEntity[]> {
    return await this.departmentsService.findChildrenDepartments(parent_id);
  }
}
