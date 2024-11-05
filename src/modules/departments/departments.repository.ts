import { Inject, Injectable } from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { eq } from 'drizzle-orm';
import { ulid } from 'ulid';

import * as entities from '@/infra/database/orm/drizzle/schema';
import { CreateDepartmentDto } from './dtos';
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
    const department = await this.drizzle
      .select()
      .from(entities.departments)
      .where(eq(entities.departments.name, name));

    return department[0] ?? null;
  }

  public async findById(id: string): Promise<DepartmentEntity | null> {
    const department: DepartmentEntity[] = await this.drizzle
      .select()
      .from(entities.departments)
      .where(eq(entities.departments.id, id));

    return department[0] ?? null;
  }
}
