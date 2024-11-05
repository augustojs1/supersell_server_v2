import { JwtModule } from '@nestjs/jwt';
import { forwardRef, Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { HashProvider } from './providers/hash.providers';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { configuration } from '@/infra/config/configuration';
import { AccessTokenGuard } from './guards';

@Module({
  imports: [
    JwtModule.register({
      secret: configuration().jwt.secret,
      signOptions: { expiresIn: configuration().jwt.expire_time },
    }),
    forwardRef(() => UsersModule),
  ],
  providers: [AccessTokenGuard, AuthService, HashProvider, AccessTokenStrategy],
  controllers: [AuthController],
  exports: [JwtModule, AccessTokenGuard],
})
export class AuthModule {}
