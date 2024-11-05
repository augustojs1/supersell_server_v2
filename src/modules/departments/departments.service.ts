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

      if (data.parent_department_id && parentDepartment.parent_department_id) {
        throw new HttpException(
          'This department already have a parent!',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    return await this.departmentsRepository.create(data);
  }

  public async findParentDepartments(): Promise<DepartmentEntity[]> {
    return await this.departmentsRepository.findParentDepartments();
  }

  public async findChildrenDepartments(
    parent_id: string,
  ): Promise<DepartmentEntity[]> {
    const parentDepartment =
      await this.departmentsRepository.findById(parent_id);

    if (!parentDepartment) {
      throw new HttpException(
        'Parent department with this id does not exists!',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.departmentsRepository.findChildrenDepartments(parent_id);
  }
}
