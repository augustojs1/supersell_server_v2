import { WishlistsController } from '@/modules/wishlists/wishlists.controller';

describe('WishlistsController', () => {
  let controller: WishlistsController;

  const service = {
    create: jest.fn(),
    findAll: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(() => {
    controller = new WishlistsController(service as any);
  });

  it('should be able to create a wishlist item', async () => {
    jest.spyOn(service, 'create').mockReturnValueOnce({} as any);

    await controller.create({} as any, {
      product_id: '123',
    });

    expect(service.create).toHaveBeenCalled();
  });

  it('should be able to read all wishlist items in a wishlist', async () => {
    jest.spyOn(service, 'findAll').mockReturnValueOnce({} as any);

    await controller.findAll({} as any);

    expect(service.findAll).toHaveBeenCalled();
  });

  it('should be able to remove a wishlist item', async () => {
    jest.spyOn(service, 'remove').mockReturnValueOnce({} as any);

    await controller.remove({} as any, {} as any);

    expect(service.remove).toHaveBeenCalled();
  });
});
