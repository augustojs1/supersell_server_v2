import { Inject, Injectable } from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';

import * as schema from '../../infra/database/orm/drizzle/schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { DATABASE_TAG } from 'src/infra/database/orm/drizzle/drizzle.module';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_TAG)
    private readonly drizzle: MySql2Database<typeof schema>,
  ) {}

  async create() {}

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
