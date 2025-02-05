import { forwardRef, Module } from '@nestjs/common';

import { ShoppingCartsService } from './shopping_carts.service';
import { ShoppingCartsController } from './shopping_carts.controller';
import { ShoppingCartsRepository } from './shopping-carts.repository';
import { AuthModule } from '../auth/auth.module';
import { ProductsModule } from '../products/products.module';
import { OrderModule } from '../order/order.module';
import { MessagingModule } from '@/infra/messaging/messaging.module';

@Module({
  controllers: [ShoppingCartsController],
  providers: [ShoppingCartsService, ShoppingCartsRepository],
  imports: [
    forwardRef(() => AuthModule),
    ProductsModule,
    OrderModule,
    MessagingModule,
  ],
  exports: [ShoppingCartsService],
})
export class ShoppingCartsModule {}
