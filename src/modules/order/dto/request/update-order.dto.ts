import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './request/create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
