import { JwtModule } from '@nestjs/jwt';
import { forwardRef, Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { HashProvider } from './providers/hash.providers';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { configuration } from '@/infra/config/configuration';
import { AccessTokenGuard, AdminGuard } from './guards';
import { ShoppingCartsModule } from '../shopping_carts/shopping_carts.module';
import { EventsModule } from '@/infra/events/events.module';

@Module({
  imports: [
    JwtModule.register({
      secret: configuration().jwt.secret,
      signOptions: { expiresIn: configuration().jwt.expire_time },
    }),
    forwardRef(() => UsersModule),
    forwardRef(() => ShoppingCartsModule),
    EventsModule,
  ],
  providers: [
    AccessTokenGuard,
    AdminGuard,
    AuthService,
    HashProvider,
    AccessTokenStrategy,
  ],
  controllers: [AuthController],
  exports: [JwtModule, AccessTokenGuard, AdminGuard],
})
export class AuthModule {}
