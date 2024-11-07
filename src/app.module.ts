import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './modules/users/users.module';
import { DrizzleModule } from './infra/database/orm/drizzle/drizzle.module';
import { configuration } from './infra/config/configuration';
import { AuthModule } from './modules/auth/auth.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { ProductsModule } from './modules/products/products.module';

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
  ],
})
export class AppModule {}
