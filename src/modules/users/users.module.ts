import { forwardRef, Module } from '@nestjs/common';
import { FastifyMulterModule } from '@nest-lab/fastify-multer';

import { UsersController } from './users.controller';
import { DrizzleModule } from '@/infra/database/orm/drizzle/drizzle.module';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { AuthModule } from '../auth/auth.module';
import { DiskStorageService } from '@/infra/storage/disk-storage.service';
import { ProductsModule } from '../products/products.module';
import { CommonModule } from '../common/common.module';

const DISK_STORAGE_PATH = './.temp/uploads/avatar';

@Module({
  imports: [
    DrizzleModule,
    forwardRef(() => ProductsModule),
    AuthModule,
    FastifyMulterModule.register({
      storage: new DiskStorageService(DISK_STORAGE_PATH),
    }),
    CommonModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
