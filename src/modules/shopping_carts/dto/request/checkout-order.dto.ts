import { IsNotEmpty, IsString } from 'class-validator';

export class CheckoutOrderDTO {
  @IsString()
  @IsNotEmpty()
  delivery_address_id: string;
}
