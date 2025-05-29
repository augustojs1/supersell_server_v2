import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { OrderStatus } from '@/modules/order/enums';
import { MessagingTopics } from '@/infra/events/enum';

export class EmailOrderStatusChangeDto {
  topic_name?: MessagingTopics.EMAIL_ORDER_STATUS_CHANGE;

  @IsNotEmpty()
  @IsString()
  order_id: string;

  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: string;

  @IsNotEmpty()
  @IsString()
  customer_id: string;

  @IsNotEmpty()
  @IsString()
  customer_name: string;

  @IsNotEmpty()
  @IsString()
  customer_email: string;

  @IsNotEmpty()
  @IsString()
  seller_id: string;
}
