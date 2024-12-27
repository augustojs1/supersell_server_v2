import { Inject, Injectable } from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { eq } from 'drizzle-orm';

import { DATABASE_TAG } from '@/infra/database/orm/drizzle/drizzle.module';
import * as schema from '@/infra/database/orm/drizzle/schema';
import { CountriesEntity } from './types';

@Injectable()
export class CountriesRepository {
  constructor(
    @Inject(DATABASE_TAG)
    private readonly drizzle: MySql2Database<typeof schema>,
  ) {}

  public async findByCode(code: string): Promise<CountriesEntity> {
    // SELECT
    // 	*
    // FROM
    // 	countries c
    // WHERE
    // 	c.code = 'BR';
    const result = await this.drizzle
      .select()
      .from(schema.countries)
      .where(eq(schema.countries.code, code));

    return result[0] ?? null;
  }
}
