import { Test, TestingModule } from '@nestjs/testing';

import { OrderRepository } from '@/modules/order/order.repository';
import { OrderService } from '@/modules/order/order.service';
import { OrderItemRepository } from '@/modules/order/order-item.repository';

describe('OrderService', () => {
  let service: OrderService;
  let orderItemRepository: OrderItemRepository;
  let repository: OrderRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: OrderRepository,
          useValue: {
            findOrderByCustomerId: jest.fn(),
            findOrderBySellerId: jest.fn(),
            create: jest.fn(),
            createItem: jest.fn(),
          },
        },
        {
          provide: OrderItemRepository,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    repository = module.get<OrderRepository>(OrderRepository);
    orderItemRepository = module.get<OrderItemRepository>(OrderItemRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to create an order', async () => {
    const data = {} as any;

    await service.create(data);

    expect(repository.create).toHaveBeenCalled();
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
