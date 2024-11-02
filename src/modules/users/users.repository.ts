import { Inject, Injectable } from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { eq } from 'drizzle-orm';
import { ulid } from 'ulid';

import * as schema from '../../infra/database/orm/drizzle/schema';
import { DATABASE_TAG } from 'src/infra/database/orm/drizzle/drizzle.module';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject(DATABASE_TAG)
    private readonly drizzle: MySql2Database<typeof schema>,
  ) {}

  public async create(user: CreateUserDto): Promise<any> {
    const createdUser = await this.drizzle.insert(schema.users).values({
      id: ulid(),
      ...user,
    });

    return createdUser;
  }

  public async findUserByEmail(email: string): Promise<any[]> {
    const user = await this.drizzle
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email));

    return user;
  }
}
