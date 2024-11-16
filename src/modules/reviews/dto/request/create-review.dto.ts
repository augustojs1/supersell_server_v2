import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsString()
  product_id: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Min(0)
  @Max(5)
  rating: number;
}
