import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { PaymentBrokerService } from './brokers/payment-broker.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CORE',
        transport: Transport.TCP,
        options: { port: 8080, host: '127.0.0.1' },
      },
    ]),
  ],
  providers: [PaymentBrokerService],
  exports: [ClientsModule, PaymentBrokerService],
})
export class MessagingModule {}
