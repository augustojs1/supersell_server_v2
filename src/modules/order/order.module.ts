import { forwardRef, Module } from '@nestjs/common';

import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { AuthModule } from '../auth/auth.module';
import { OrderRepository } from './order.repository';
import { OrderItemRepository } from './order-item.repository';

@Module({
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, OrderItemRepository],
  imports: [forwardRef(() => AuthModule)],
  exports: [OrderService],
})
export class OrderModule {}
