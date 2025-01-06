import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './modules/users/users.module';
import { DrizzleModule } from './infra/database/orm/drizzle/drizzle.module';
import { configuration } from './infra/config/configuration';
import { AuthModule } from './modules/auth/auth.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { ProductsModule } from './modules/products/products.module';
import { ProductsImagesModule } from './modules/products_images/products_images.module';
import { WishlistsModule } from './modules/wishlists/wishlists.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { ShoppingCartsModule } from './modules/shopping_carts/shopping_carts.module';
import { AddressModule } from './modules/address/address.module';
import { OrderModule } from './modules/order/order.module';
import { CommonModule } from './modules/common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/src/infra/config/env/development.env`,
      isGlobal: true,
      load: [configuration],
    }),
    DrizzleModule,
    UsersModule,
    AuthModule,
    DepartmentsModule,
    ProductsModule,
    ProductsImagesModule,
    WishlistsModule,
    ReviewsModule,
    ShoppingCartsModule,
    AddressModule,
    OrderModule,
    CommonModule,
  ],
})
export class AppModule {}
