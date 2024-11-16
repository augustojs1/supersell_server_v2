export class ReviewsEntityDto {
  id: string;
  user_id: string;
  product_id: string;
  content: string;
  rating: number;
  created_at: Date;
  updated_at: Date;
}
