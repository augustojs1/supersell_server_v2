import { forwardRef, Module } from '@nestjs/common';
import { ShoppingCartsService } from './shopping_carts.service';
import { ShoppingCartsController } from './shopping_carts.controller';
import { ShoppingCartsRepository } from './shopping-carts.repository';
import { AuthModule } from '../auth/auth.module';
import { ProductsModule } from '../products/products.module';

@Module({
  controllers: [ShoppingCartsController],
  providers: [ShoppingCartsService, ShoppingCartsRepository],
  imports: [forwardRef(() => AuthModule), ProductsModule],
  exports: [ShoppingCartsService],
})
export class ShoppingCartsModule {}
