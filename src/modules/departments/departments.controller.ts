import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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
import { AccessTokenGuard } from '../auth/guards';

@UseGuards(AccessTokenGuard)
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

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

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() data: UpdateDepartmentDto,
  ): Promise<void> {
    return await this.departmentsService.update(id, data);
  }

  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<void> {
    return await this.departmentsService.delete(id);
  }
}
