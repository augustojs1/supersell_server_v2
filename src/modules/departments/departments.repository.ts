import { Inject, Injectable } from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { eq, isNull } from 'drizzle-orm';
import { ulid } from 'ulid';

import * as entities from '@/infra/database/orm/drizzle/schema';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dtos';
import { DATABASE_TAG } from '@/infra/database/orm/drizzle/drizzle.module';
import { DepartmentEntity } from './types';

@Injectable()
export class DepartmentsRepository {
  constructor(
    @Inject(DATABASE_TAG)
    private readonly drizzle: MySql2Database<typeof entities>,
  ) {}

  public async create(
    data: CreateDepartmentDto,
  ): Promise<DepartmentEntity | null> {
    // INSERT INTO departments (id, parent_department_id, name, description)
    // VALUES (`data.id`, `data.parent_department_id`, `data.name`, `data.description`);

    const id = ulid();

    await this.drizzle.insert(entities.departments).values({
      id: id,
      parent_department_id: data.parent_department_id ?? null,
      name: data.name,
      description: data.description ?? null,
    } as DepartmentEntity);

    return await this.findById(id);
  }

  public async findByName(name: string): Promise<DepartmentEntity | null> {
    // SELECT * FROM departments AS d WHERE d.name = `name`;

    const department = await this.drizzle
      .select()
      .from(entities.departments)
      .where(eq(entities.departments.name, name));

    return department[0] ?? null;
  }

  public async findById(id: string): Promise<DepartmentEntity | null> {
    // SELECT * FROM departments AS d WHERE d.id = `id`;

    const department: DepartmentEntity[] = await this.drizzle
      .select()
      .from(entities.departments)
      .where(eq(entities.departments.id, id));

    return department[0] ?? null;
  }

  public async findParentDepartments(): Promise<DepartmentEntity[]> {
    // SELECT * FROM departments AS d WHERE d.parent_department_id IS NULL;

    return await this.drizzle
      .select()
      .from(entities.departments)
      .where(isNull(entities.departments.parent_department_id));
  }

  public async findChildrenDepartments(
    parent_id: string,
  ): Promise<DepartmentEntity[]> {
    // SELECT * FROM departments AS d WHERE d.parent_department_id = `parent_id`;

    return await this.drizzle
      .select()
      .from(entities.departments)
      .where(eq(entities.departments.parent_department_id, parent_id));
  }

  public async update(id: string, data: UpdateDepartmentDto): Promise<void> {
    // UPDATE departments AS d
    // SET
    //   d.parent_department_id = `data.parent_department_id`,
    //   d.name = `data.name`
    // WHERE
    //   d.id = `id`;

    await this.drizzle
      .update(entities.departments)
      .set({
        name: data.name,
        description: data.description ?? null,
        parent_department_id: data.parent_department_id ?? null,
      } as DepartmentEntity)
      .where(eq(entities.departments.id, id));
  }

  public async delete(id: string): Promise<void> {
    // DELETE FROM departments AS d WHERE d.id = `id`;

    await this.drizzle
      .delete(entities.departments)
      .where(eq(entities.departments.id, id));
  }
}
