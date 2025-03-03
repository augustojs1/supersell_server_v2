import { forwardRef, Module } from '@nestjs/common';

import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { AuthModule } from '../auth/auth.module';
import { OrderRepository } from './order.repository';
import { OrderItemRepository } from './order-item.repository';
import { ShoppingCartsModule } from '../shopping_carts/shopping_carts.module';
import { MessagingModule } from '@/infra/messaging/messaging.module';
import { AddressModule } from '../address/address.module';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, OrderItemRepository],
  imports: [
    forwardRef(() => AuthModule),
    ShoppingCartsModule,
    AddressModule,
    MessagingModule,
    UsersModule,
  ],
  exports: [OrderService],
})
export class OrderModule {}
