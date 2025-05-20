import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { configuration } from '@/infra/config/configuration';
import { EmailEventsRabbitMqPublisher } from './publishers/emails/impl/email-events-rabbitmq.publisher';
import { PaymentEventsRabbitMqPublisher } from './publishers/payment/impl/payment-events-rabbitmq.publisher';
import { IPaymentEventsPublisher } from './publishers/payment/ipayment-events-publisher.interface';
import { PaymentEventsSnsPublisher } from './publishers/payment/impl';
import { IEmailEventsPublisher } from './publishers/emails/iemail-events-publisher.interface';
import { EmailEventsSnsPublisher } from './publishers/emails/impl';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EMAIL_MICROSERVICE',
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
        name: 'PAYMENT_MICROSERVICE',
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
  ],
  providers: [
    {
      provide: IPaymentEventsPublisher,
      useClass:
        configuration().NODE_ENV === 'development'
          ? PaymentEventsRabbitMqPublisher
          : PaymentEventsSnsPublisher,
    },
    {
      provide: IEmailEventsPublisher,
      useClass:
        configuration().NODE_ENV === 'development'
          ? EmailEventsRabbitMqPublisher
          : EmailEventsSnsPublisher,
    },
  ],
  exports: [ClientsModule, IPaymentEventsPublisher, IEmailEventsPublisher],
})
export class EventsModule {}
