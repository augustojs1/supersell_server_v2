import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { DrizzleModule } from 'src/infra/database/orm/drizzle/drizzle.module';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  imports: [DrizzleModule],
  exports: [UsersService],
})
export class UsersModule {}
