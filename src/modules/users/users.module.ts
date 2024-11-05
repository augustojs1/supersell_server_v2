import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { DrizzleModule } from 'src/infra/database/orm/drizzle/drizzle.module';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  imports: [DrizzleModule, AuthModule],
})
export class UsersModule {}
