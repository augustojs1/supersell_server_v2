import { Module } from '@nestjs/common';

import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { WishlistsRepository } from '@/modules/wishlists/wishlists.repository';
import { ProductsModule } from '../products/products.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [WishlistsController],
  imports: [AuthModule, ProductsModule],
  providers: [WishlistsService, WishlistsRepository],
})
export class WishlistsModule {}
