import { forwardRef, Module } from '@nestjs/common';
import * as multer from 'fastify-multer';
import { FastifyMulterModule } from '@nest-lab/fastify-multer';

import { UsersController } from './users.controller';
import { DrizzleModule } from '@/infra/database/orm/drizzle/drizzle.module';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { AuthModule } from '../auth/auth.module';
import { ProductsModule } from '../products/products.module';
import { CommonModule } from '../common/common.module';
import { AwsS3StorageService } from '@/infra/storage/impl/aws-s3-storage.service';

@Module({
  imports: [
    DrizzleModule,
    forwardRef(() => ProductsModule),
    AuthModule,
    FastifyMulterModule.register({
      storage: multer.memoryStorage(),
    }),
    CommonModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, AwsS3StorageService],
  exports: [UsersService],
})
export class UsersModule {}
