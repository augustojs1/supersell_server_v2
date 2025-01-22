import { Test, TestingModule } from '@nestjs/testing';

import { ShoppingCartsRepository } from '@/modules/shopping_carts/shopping-carts.repository';
import { ShoppingCartsService } from '@/modules/shopping_carts/shopping_carts.service';
import { ProductsService } from '@/modules/products/products.service';
import { OrderService } from '@/modules/order/order.service';

describe('ShoppingCartsService', () => {
  let service: ShoppingCartsService;
  let repository: ShoppingCartsRepository;
  let productsService: ProductsService;
  let orderService: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShoppingCartsService,
        {
          provide: ShoppingCartsRepository,
          useValue: {
            findByUserId: jest.fn(),
            create: jest.fn(),
            findAll: jest.fn(),
            findShoppingCartItemByUserIdAndProductId: jest.fn(),
            createItemAndUpdateShoppingCartValueTrx: jest.fn(),
            updateQuantityAndTotalPriceTrx: jest.fn(),
            removeItemAndUpdateTotalPriceTrx: jest.fn(),
            checkOutFlowTrx: jest.fn(),
          },
        },
        {
          provide: ProductsService,
          useValue: {
            findByIdElseThrow: jest.fn(),
            findById: jest.fn(),
          },
        },
        {
          provide: OrderService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ShoppingCartsService>(ShoppingCartsService);
    repository = module.get<ShoppingCartsRepository>(ShoppingCartsRepository);
    productsService = module.get<ProductsService>(ProductsService);
    orderService = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should not be able to add a non existent product to the shopping cart', async () => {
    const user_id = '123';
    const product_id = '321';

    jest
      .spyOn(service, 'findByUserIdElseThrow')
      .mockResolvedValueOnce({} as any);

    jest
      .spyOn(productsService, 'findByIdElseThrow')
      .mockRejectedValueOnce({ status: 400 });

    try {
      await service.createShoppingCartItem(user_id, product_id);
    } catch (error) {
      expect(error.status).toBe(400);
    }
  });

  it('should not be able to add an owned product to its own shopping cart', async () => {
    const user_id = '123';
    const product_id = '321';

    jest
      .spyOn(service, 'findByUserIdElseThrow')
      .mockResolvedValueOnce({} as any);

    jest.spyOn(productsService, 'findByIdElseThrow').mockResolvedValueOnce({
      user_id: '123',
    } as any);

    try {
      await service.createShoppingCartItem(user_id, product_id);
    } catch (error) {
      expect(error.status).toBe(403);
    }
  });

  it('should not be able to add out of stock product to the shopping cart', async () => {
    const user_id = '123';
    const product_id = '321';

    jest
      .spyOn(service, 'findByUserIdElseThrow')
      .mockResolvedValueOnce({} as any);

    jest.spyOn(productsService, 'findByIdElseThrow').mockResolvedValueOnce({
      quantity: 0,
      is_in_stock: false,
    } as any);

    try {
      await service.createShoppingCartItem(user_id, product_id);
    } catch (error) {
      expect(error.status).toBe(400);
    }
  });

  it('should not be able to the same product to the shopping cart', async () => {
    const user_id = '123';
    const product_id = '321';

    jest
      .spyOn(service, 'findByUserIdElseThrow')
      .mockResolvedValueOnce({} as any);

    jest.spyOn(productsService, 'findByIdElseThrow').mockResolvedValueOnce({
      quantity: 20,
      is_in_stock: true,
    } as any);

    jest
      .spyOn(repository, 'findShoppingCartItemByUserIdAndProductId')
      .mockResolvedValueOnce({} as any);

    try {
      await service.createShoppingCartItem(user_id, product_id);
    } catch (error) {
      expect(error.status).toBe(400);
    }
  });

  it('should be able to add a product to the shopping cart', async () => {
    const user_id = '123';
    const product_id = '321';

    jest
      .spyOn(service, 'findByUserIdElseThrow')
      .mockResolvedValueOnce({} as any);

    jest.spyOn(productsService, 'findByIdElseThrow').mockResolvedValueOnce({
      quantity: 20,
      is_in_stock: true,
    } as any);

    jest
      .spyOn(repository, 'findShoppingCartItemByUserIdAndProductId')
      .mockResolvedValueOnce(null);

    await service.createShoppingCartItem(user_id, product_id);

    expect(
      repository.createItemAndUpdateShoppingCartValueTrx,
    ).toHaveBeenCalled();
  });

  it('should be able to read all products from shopping cart', async () => {
    const user_id = '123';

    await service.findAll(user_id);

    expect(repository.findAll).toHaveBeenCalled();
  });

  it('should not be able to update a non existent shopping cart item', async () => {
    const user_id = '123';
    const product_id = '321';
    const quantity = 3;

    jest
      .spyOn(repository, 'findShoppingCartItemByUserIdAndProductId')
      .mockResolvedValueOnce(null);

    try {
      await service.update(user_id, product_id, quantity);
    } catch (error) {
      expect(error.status).toBe(404);
    }
  });

  it('should not be able to add a out of range quantity to shopping cart item', async () => {
    const user_id = '123';
    const product_id = '321';
    const quantity = 3;

    jest
      .spyOn(repository, 'findShoppingCartItemByUserIdAndProductId')
      .mockResolvedValueOnce({} as any);

    jest
      .spyOn(productsService, 'findByIdElseThrow')
      .mockResolvedValueOnce({ quantity: 1 } as any);

    try {
      await service.update(user_id, product_id, quantity);
    } catch (error) {
      expect(error.status).toBe(400);
    }
  });

  it('should be able to update a shopping cart item', async () => {
    const user_id = '123';
    const product_id = '321';
    const quantity = 3;

    jest
      .spyOn(repository, 'findShoppingCartItemByUserIdAndProductId')
      .mockResolvedValueOnce({
        shopping_cart_item: {
          quantity: 2,
          price: 13,
        },
      } as any);

    jest
      .spyOn(productsService, 'findByIdElseThrow')
      .mockResolvedValueOnce({ quantity: 190 } as any);

    jest
      .spyOn(service, 'findByUserIdElseThrow')
      .mockResolvedValueOnce({ total_price: 30 } as any);

    await service.update(user_id, product_id, quantity);

    expect(repository.updateQuantityAndTotalPriceTrx).toHaveBeenCalled();
  });

  it('should throw an error when trying to remove a non existent shopping cart item', async () => {
    const user_id = '123';
    const product_id = '321';

    jest
      .spyOn(repository, 'findShoppingCartItemByUserIdAndProductId')
      .mockResolvedValueOnce(null);

    try {
      await service.remove(user_id, product_id);
    } catch (error) {
      expect(error.status).toBe(404);
    }
  });

  it('should throw an error when trying to remove a non existent shopping cart item', async () => {
    const user_id = '123';
    const product_id = '321';

    jest
      .spyOn(repository, 'findShoppingCartItemByUserIdAndProductId')
      .mockResolvedValueOnce(null);

    try {
      await service.remove(user_id, product_id);
    } catch (error) {
      expect(error.status).toBe(404);
    }
  });

  it('should be able to remove a shopping cart item', async () => {
    const user_id = '123';
    const product_id = '321';

    jest
      .spyOn(repository, 'findShoppingCartItemByUserIdAndProductId')
      .mockResolvedValueOnce({
        shopping_cart: {
          total_value: 300,
        },
        shopping_cart_item: {
          price: 10,
          quantity: 2,
        },
      } as any);

    await service.remove(user_id, product_id);

    expect(repository.removeItemAndUpdateTotalPriceTrx).toHaveBeenCalled();
  });
});
