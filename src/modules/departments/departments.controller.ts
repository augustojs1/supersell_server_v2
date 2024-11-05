import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { DepartmentsService } from './departments.service';
import { GetCurrentUserDecorator } from '../auth/decorators';
import { CurrentUser } from '../auth/types';
import { CreateDepartmentDto } from './dtos';
import { AccessTokenGuard } from '../auth/guards';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  public async create(
    @GetCurrentUserDecorator() user: CurrentUser,
    @Body() data: CreateDepartmentDto,
  ) {
    return await this.departmentsService.create(data);
  }
}
