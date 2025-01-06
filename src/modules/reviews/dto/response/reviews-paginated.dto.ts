import { PaginationData } from '@/modules/common/types';
import { ReviewsEntity } from '../../types';

export class ReviewsPaginatedDto {
  data: ReviewsEntity[];
  meta: PaginationData;
}
