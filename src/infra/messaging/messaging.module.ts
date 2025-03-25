import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { PaymentBrokerService } from './brokers/payment-broker.service';
import { configuration } from '../config/configuration';
import { EmailBrokerService } from './brokers/email-broker.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EXTERNAL_SERVICE_MICROSERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'email',
          queueOptions: {
            durable: true,
          },
        },
      },
      {
        name: 'EXTERNAL_SERVICE_MICROSERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'payment',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    // ClientsModule.register([
    //   {
    //     name: 'EXTERNAL_SERVICE_MICROSERVICE',
    //     transport: Transport.TCP,
    //     options: {
    //       port: configuration().supersell_external_service.port,
    //       host: configuration().supersell_external_service.host,
    //     },
    //   },
    // ]),
  ],
  providers: [PaymentBrokerService, EmailBrokerService],
  exports: [ClientsModule, PaymentBrokerService, EmailBrokerService],
})
export class MessagingModule {}
