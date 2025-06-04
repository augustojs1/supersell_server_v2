import { Module } from '@nestjs/common';

import { configuration } from '@/infra/config/configuration';
import { IPaymentGateway } from '@/infra/payment-gateway/ipayment-gateway.interface';
import {
  MockPaymentGatewayService,
  StripePaymentGatewayService,
} from '@/infra/payment-gateway/impl';
import { ConfigModule } from '@nestjs/config';

const env = configuration();

@Module({
  providers: [
    // {
    //   provide: IPaymentGateway,
    //   useClass:
    //     env.NODE_ENV === 'development'
    //       ? MockPaymentGatewayService
    //       : StripePaymentGatewayService,
    // },
    {
      provide: IPaymentGateway,
      useClass: StripePaymentGatewayService,
    },
  ],
  exports: [IPaymentGateway],
  imports: [ConfigModule],
})
export class PaymentGatewayModule {}
