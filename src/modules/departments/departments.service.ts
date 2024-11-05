import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreateDepartmentDto } from './dtos';
import { DepartmentsRepository } from './departments.repository';
import { DepartmentEntity } from './types';

@Injectable()
export class DepartmentsService {
  constructor(private readonly departmentsRepository: DepartmentsRepository) {}

  public async create(
    data: CreateDepartmentDto,
  ): Promise<DepartmentEntity | null> {
    const department = await this.departmentsRepository.findByName(data.name);

    if (department) {
      throw new HttpException(
        'Department with this name already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (data.parent_department_id) {
      const parentDepartment: DepartmentEntity =
        await this.departmentsRepository.findById(data.parent_department_id);

      if (!parentDepartment) {
        throw new HttpException(
          'Parent department does not exists!',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    return await this.departmentsRepository.create(data);
  }
}
