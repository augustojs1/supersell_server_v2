import { Test, TestingModule } from '@nestjs/testing';

import { WishlistsRepository } from '@/modules/wishlists/wishlists.repository';
import { WishlistsService } from '@/modules/wishlists/wishlists.service';
import { ProductsService } from '@/modules/products/products.service';
import { CreateWishlistDto } from '@/modules/wishlists/dto/create-wishlist.dto';
import { ProductEntity } from '@/modules/products/types';

describe('WishlistsService', () => {
  let service: WishlistsService;
  let productService: ProductsService;
  let repository: WishlistsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishlistsService,
        {
          provide: WishlistsRepository,
          useValue: {
            findByName: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
            updated: jest.fn(),
            findByUserIdAndProductId: jest.fn(),
            findAllByUserId: jest.fn(),
          },
        },
        {
          provide: ProductsService,
          useValue: {
            create: jest.fn(),
            findByIdElseThrow: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WishlistsService>(WishlistsService);
    productService = module.get<ProductsService>(ProductsService);
    repository = module.get<WishlistsRepository>(WishlistsRepository);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  describe('Create', () => {
    it('should not be able to add a product to a wishlist if product does not exists!', async () => {
      // Arrange
      const userId = '123';
      const dto: CreateWishlistDto = {
        product_id: '112233',
      };

      jest.spyOn(productService, 'findByIdElseThrow').mockRejectedValueOnce({
        status: 400,
        message: 'Product with this id does not exists!',
      });

      try {
        // Act
        await service.create(userId, dto);
      } catch (error) {
        // Assert
        expect(error.status).toBe(400);
      }
    });

    it('should not be able to add their own products to wishlists', async () => {
      // Arrange
      const userId = '123';
      const dto: CreateWishlistDto = {
        product_id: '123',
      };
      const product: ProductEntity = {} as any;

      jest
        .spyOn(productService, 'findByIdElseThrow')
        .mockResolvedValueOnce(product);
      jest
        .spyOn(repository, 'findByUserIdAndProductId')
        .mockResolvedValue(null);

      try {
        // Act
        await service.create(userId, dto);
      } catch (error) {
        // Assert
        expect(error.status).toBe(400);
      }
    });

    it('should be able to add a product to a wishlist', async () => {
      // Arrange
      const userId = '123';
      const dto: CreateWishlistDto = {
        product_id: '321',
      };
      const product: ProductEntity = {
        user_id: '321',
      } as any;

      jest
        .spyOn(productService, 'findByIdElseThrow')
        .mockResolvedValueOnce(product);

      jest
        .spyOn(repository, 'findByUserIdAndProductId')
        .mockResolvedValue(null);

      // Act
      await service.create(userId, dto);

      // Assert
      expect(repository.create).toHaveBeenCalled();
    });
  });

  describe('FindAll', () => {
    it('should be able to return wishlist items', async () => {
      const user_id = '123';

      await service.findAll(user_id);

      expect(repository.findAllByUserId).toHaveBeenCalled();
      expect(repository.findAllByUserId).toHaveBeenCalledWith(user_id);
    });
  });

  describe('Remove', () => {
    it('should throw an error when trying to remove a non existent wishlist item', async () => {
      // Arrange
      const user_id = '123';
      const product_id = '321';

      jest
        .spyOn(service, 'findByUserIdAndProductIdElseThrow')
        .mockRejectedValueOnce({
          status: 400,
          message: 'Product with this id does not exists!',
        });

      try {
        // Act
        await service.remove(user_id, product_id);
      } catch (error) {
        // Assert
        expect(error.status).toBe(400);
      }
    });

    it('should not be able to remove item from another user wishlist', async () => {
      // Arrange
      const user_id = '123';
      const product_id = '321';
      const wishlist = {
        user_id: '123',
      };

      jest
        .spyOn(service, 'findByUserIdAndProductIdElseThrow')
        .mockResolvedValueOnce(wishlist as any);

      try {
        // Act
        await service.remove(user_id, product_id);
      } catch (error) {
        // Assert
        expect(error.status).toBe(403);
      }
    });

    it('should be able to remove an item from wishlist', async () => {
      // Arrange
      const user_id = '123';
      const product_id = '321';
      const wishlist = {
        user_id: '123',
      };

      jest
        .spyOn(service, 'findByUserIdAndProductIdElseThrow')
        .mockResolvedValueOnce(wishlist as any);

      // Act
      await service.remove(user_id, product_id);

      // Assert
      expect(repository.delete).toHaveBeenCalled();
    });
  });
});
