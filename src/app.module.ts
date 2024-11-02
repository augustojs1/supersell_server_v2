import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './modules/users/users.module';
import { DrizzleModule } from './infra/database/orm/drizzle/drizzle.module';
import { configuration } from './infra/config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/src/infra/config/env/development.env`,
      isGlobal: true,
      load: [configuration],
    }),
    DrizzleModule,
    UsersModule,
  ],
})
export class AppModule {}
