import { Test, TestingModule } from '@nestjs/testing';

import { OrderRepository } from '@/modules/order/order.repository';
import { OrderService } from '@/modules/order/order.service';
import { OrderItemRepository } from '@/modules/order/order-item.repository';
import { ShoppingCartsService } from '@/modules/shopping_carts/shopping_carts.service';
import { AddressService } from '@/modules/address/address.service';
import { IEmailEventsPublisher } from '@/infra/events/publishers/emails/iemail-events-publisher.interface';
import { IPaymentEventsPublisher } from '@/infra/events/publishers/payment/ipayment-events-publisher.interface';
import { IPaymentGateway } from '@/infra/payment-gateway/ipayment-gateway.interface';
import { UsersService } from '@/modules/users/users.service';

describe('OrderService', () => {
  let service: OrderService;
  let orderItemRepository: OrderItemRepository;
  let repository: OrderRepository;
  let shoppingCartsService: ShoppingCartsService;
  let addressService: AddressService;
  let emailEventsPublisher: IEmailEventsPublisher;
  let paymentEventsPublisher: IPaymentEventsPublisher;
  let paymenteGateway: IPaymentGateway;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: OrderRepository,
          useValue: {
            findOrderByCustomerId: jest.fn(),
            findOrderBySellerId: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            createItem: jest.fn(),
            updateOrderStatus: jest.fn(),
            findOrderCustomerByOrderId: jest.fn(),
          },
        },
        {
          provide: OrderItemRepository,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: 'DB_DEV',
          useValue: {
            transaction: jest.fn((cb) =>
              cb({
                insert: jest.fn().mockReturnThis(),
                update: jest.fn().mockReturnThis(),
                delete: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                set: jest.fn().mockReturnThis(),
                values: jest.fn().mockReturnThis(),
              }),
            ),
          },
        },
        {
          provide: ShoppingCartsService,
          useValue: {
            findAll: jest.fn(),
          },
        },
        {
          provide: AddressService,
          useValue: {
            findByUserAddressIdElseThrow: jest.fn(),
            checkUserIsOwnerElseThrow: jest.fn(),
          },
        },
        {
          provide: IEmailEventsPublisher,
          useValue: {
            emitEmailOrderStatusChangeMessage: jest.fn(),
            emitEmailOrderReceiptMessage: jest.fn(),
          },
        },
        {
          provide: IPaymentEventsPublisher,
          useValue: {
            sendOrderPaymentMessage: jest.fn(),
          },
        },
        {
          provide: IPaymentEventsPublisher,
          useValue: {
            sendOrderPaymentMessage: jest.fn(),
          },
        },
        {
          provide: IPaymentGateway,
          useValue: {
            sendOrderPaymentMessage: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    repository = module.get<OrderRepository>(OrderRepository);
    orderItemRepository = module.get<OrderItemRepository>(OrderItemRepository);
    shoppingCartsService =
      module.get<ShoppingCartsService>(ShoppingCartsService);
    addressService = module.get<AddressService>(AddressService);
    emailEventsPublisher = module.get<IEmailEventsPublisher>(
      IEmailEventsPublisher,
    );
    paymentEventsPublisher = module.get<IPaymentEventsPublisher>(
      IPaymentEventsPublisher,
    );
    paymenteGateway = module.get<IPaymentGateway>(IPaymentGateway);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should not be able to update a non existent order', async () => {
    const id = '123';
    const user_id = '321';
    const status = 'PAID' as any;
    const order = {
      id,
    };

    jest.spyOn(repository, 'findById').mockResolvedValueOnce(null);

    try {
      await service.updateStatus(id, user_id, status);
    } catch (error) {
      expect(error.status).toBe(404);
    }
  });

  it('should not be able to update a product order from a different user', async () => {
    const id = '123';
    const user_id = '321';
    const status = 'PAID' as any;
    const order = {
      seller_id: '111',
    } as any;

    jest.spyOn(repository, 'findById').mockResolvedValueOnce(order);
    jest
      .spyOn(repository, 'findOrderCustomerByOrderId')
      .mockResolvedValueOnce(order);

    try {
      await service.updateStatus(id, user_id, status);
    } catch (error) {
      expect(error.status).toBe(403);
    }
  });

  it('should be able to update an order status', async () => {
    const id = '123';
    const user_id = '321';
    const status = 'PAID' as any;
    const order = {
      seller_id: '321',
    } as any;

    jest.spyOn(repository, 'findById').mockResolvedValueOnce(order);
    jest
      .spyOn(repository, 'findOrderCustomerByOrderId')
      .mockResolvedValueOnce(order);

    await service.updateStatus(id, user_id, status);

    expect(repository.updateOrderStatus).toHaveBeenCalled();
  });

  it('should emit publish event on change email order topic after successfully changed order status', async () => {
    const id = '123';
    const user_id = '321';
    const status = 'PAID' as any;
    const order = {
      seller_id: '321',
    } as any;

    jest.spyOn(repository, 'findById').mockResolvedValueOnce(order);
    jest
      .spyOn(repository, 'findOrderCustomerByOrderId')
      .mockResolvedValueOnce(order);

    await service.updateStatus(id, user_id, status);

    expect(repository.updateOrderStatus).toHaveBeenCalled();
    expect(repository.updateOrderStatus).toHaveBeenCalled();
    expect(
      emailEventsPublisher.emitEmailOrderStatusChangeMessage,
    ).toHaveBeenCalled();
  });

  it('should be able to create an order item', async () => {
    const data = {} as any;

    await service.createItem(data);

    expect(orderItemRepository.create).toHaveBeenCalled();
  });

  it('should be able to return user oders', async () => {
    const customer_id = '123';
    const status = 'PAID';

    await service.findOrderByCustomerId(customer_id, status as any);

    expect(repository.findOrderByCustomerId).toHaveBeenCalled();
  });

  it('should be able to return user products orders', async () => {
    const customer_id = '123';
    const status = 'PAID';

    await service.findOrderBySellerId(customer_id, status as any);

    expect(repository.findOrderBySellerId).toHaveBeenCalled();
  });
});
