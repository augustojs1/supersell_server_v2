import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/request/create-review.dto';
import { AccessTokenGuard } from '../auth/guards';
import { ReviewsEntityDto } from './dto';
import { GetCurrentUserDecorator } from '../auth/decorators';
import { CurrentUser } from '../auth/types';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  public async create(
    @Body() data: CreateReviewDto,
    @GetCurrentUserDecorator() user: CurrentUser,
  ): Promise<ReviewsEntityDto> {
    return await this.reviewsService.create(user.sub, data);
  }

  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(+id);
  }
}
