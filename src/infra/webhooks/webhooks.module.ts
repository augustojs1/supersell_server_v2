import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { WebhooksController } from './webhooks.controller';
import { OrderModule } from '@/modules/order/order.module';

@Module({
  controllers: [WebhooksController],
  imports: [ConfigModule, OrderModule],
})
export class WebhooksModule {}
