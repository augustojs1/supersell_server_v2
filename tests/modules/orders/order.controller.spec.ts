import { OrderController } from '@/modules/order/order.controller';

describe('OrderController', () => {
  let controller: OrderController;

  const service = {
    findOrderByCustomerId: jest.fn(),
    findOrderBySellerId: jest.fn(),
    updateStatus: jest.fn(),
  };

  beforeEach(() => {
    controller = new OrderController(service as any);
  });

  it('should be able to return a user orders', async () => {
    jest.spyOn(service, 'findOrderByCustomerId').mockReturnValueOnce({} as any);

    await controller.findOrders({} as any, {} as any);

    expect(service.findOrderByCustomerId).toHaveBeenCalled();
  });

  it('should be able to return a user product orders', async () => {
    jest.spyOn(service, 'findOrderBySellerId').mockReturnValueOnce({} as any);

    await controller.findSales({} as any, {} as any);

    expect(service.findOrderBySellerId).toHaveBeenCalled();
  });

  it('should be able to update a order status', async () => {
    jest.spyOn(service, 'updateStatus').mockReturnValueOnce({} as any);

    await controller.updateStatus({} as any, {} as any, {} as any);

    expect(service.updateStatus).toHaveBeenCalled();
  });
});
