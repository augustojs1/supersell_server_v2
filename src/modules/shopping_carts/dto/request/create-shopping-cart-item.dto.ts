import { IsNotEmpty, IsString } from 'class-validator';

export class CreateShoppingCartItemDto {
  @IsString()
  @IsNotEmpty()
  product_id: string;
}
