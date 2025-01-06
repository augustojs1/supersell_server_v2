import { Module } from '@nestjs/common';

import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { ReviewsRepository } from './reviews.repository';
import { AuthModule } from '../auth/auth.module';
import { ProductsModule } from '../products/products.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [AuthModule, ProductsModule, CommonModule],
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewsRepository],
})
export class ReviewsModule {}
