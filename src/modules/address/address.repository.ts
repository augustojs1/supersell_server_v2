import { Inject, Injectable } from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { and, eq } from 'drizzle-orm';
import { ulid } from 'ulid';

import { DATABASE_TAG } from '@/infra/database/orm/drizzle/drizzle.module';
import * as schema from '@/infra/database/orm/drizzle/schema';
import { CreateAddressDto } from './dto';
import { AddressEntity } from './types';
import { AddressType } from './enums';

@Injectable()
export class AddressRepository {
  constructor(
    @Inject(DATABASE_TAG)
    private readonly drizzle: MySql2Database<typeof schema>,
  ) {}

  public async create(
    data: CreateAddressDto,
    user_id: string,
  ): Promise<AddressEntity> {
    //  INSERT INTO
    // 	address (id, user_id, country_code, type, alias, complement, `number`, street, neighborhood, district, postalcode, city)
    // VALUES
    // 	('teste', 'teste',
    // 	'teste', 'teste', 'teste',
    // 	'teste', '565',
    // 	'teste', 'teste', 'teste', 'teste', 'teste');
    const id = ulid();

    await this.drizzle.insert(schema.address).values({
      id,
      user_id,
      ...data,
    });

    return this.findById(id);
  }

  public async findById(id: string): Promise<AddressEntity | null> {
    // SELECT
    // 	*
    // FROM
    // 	address a
    // WHERE
    // 	a.id = 'id';
    const result = await this.drizzle
      .select()
      .from(schema.address)
      .where(eq(schema.address.id, id));

    return result[0] ?? null;
  }

  public async findAllByUserId(user_id: string): Promise<AddressEntity[]> {
    // SELECT
    // 	*
    // FROM
    // 	address a
    // WHERE
    // 	a.user_id = 'user_id';
    const result = await this.drizzle
      .select()
      .from(schema.address)
      .where(eq(schema.address.user_id, user_id));

    return result;
  }

  public async findAllByUserIdAndType(
    user_id: string,
    type: AddressType,
  ): Promise<AddressEntity[]> {
    // SELECT
    // 	*
    // FROM
    // 	address a
    // WHERE
    // 	a.user_id = 'user_id'
    // AND
    // 	a.`type` = 'type';
    const result = await this.drizzle
      .select()
      .from(schema.address)
      .where(
        and(eq(schema.address.user_id, user_id), eq(schema.address.type, type)),
      );

    return result;
  }

  public async delete(id: string, user_id: string): Promise<void> {
    //  DELETE FROM
    // 	address a
    // WHERE
    // 	a.id = '123'
    // AND
    //  a.user_id = 'adasa';
    await this.drizzle
      .delete(schema.address)
      .where(
        and(eq(schema.address.id, id), eq(schema.address.user_id, user_id)),
      );
  }
}
