import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWishlistDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Product Id to be add to wishlist.',
  })
  product_id: string;
}
