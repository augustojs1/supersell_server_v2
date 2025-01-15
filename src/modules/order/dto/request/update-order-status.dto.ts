import { IsEnum, IsNotEmpty } from 'class-validator';

import { OrderStatus } from '../../enums';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;
}
