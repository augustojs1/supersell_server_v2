import { Test, TestingModule } from '@nestjs/testing';

import { ProductsService } from '@/modules/products/products.service';
import { ReviewsRepository } from '@/modules/reviews/reviews.repository';
import { ReviewsService } from '@/modules/reviews/reviews.service';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let productService: ProductsService;
  let repository: ReviewsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: ReviewsRepository,
          useValue: {
            findByUserIdAndProductId: jest.fn(),
            create: jest.fn(),
            findById: jest.fn(),
            findAllByProductId: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: ProductsService,
          useValue: {
            findByIdElseThrow: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    productService = module.get<ProductsService>(ProductsService);
    repository = module.get<ReviewsRepository>(ReviewsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('user should not be able to review their own products', async () => {
    const user_id = '123';
    const product = {
      user_id: '123',
    } as any;

    jest
      .spyOn(productService, 'findByIdElseThrow')
      .mockReturnValueOnce(product);

    try {
      await service.create(user_id, {} as any);
    } catch (error) {
      expect(error.status).toBe(403);
    }
  });

  it('user should not be able to add more than one review to a single product', async () => {
    const user_id = '123';
    const product = {
      user_id: '111',
    } as any;

    jest
      .spyOn(productService, 'findByIdElseThrow')
      .mockReturnValueOnce(product);

    jest
      .spyOn(repository, 'findByUserIdAndProductId')
      .mockResolvedValueOnce([{}] as any);

    try {
      await service.create(user_id, {} as any);
    } catch (error) {
      expect(error.status).toBe(403);
    }
  });

  it('user should able to add a review to a product', async () => {
    const user_id = '123';
    const product = {
      user_id: '111',
    } as any;

    jest
      .spyOn(productService, 'findByIdElseThrow')
      .mockReturnValueOnce(product);

    jest
      .spyOn(repository, 'findByUserIdAndProductId')
      .mockResolvedValueOnce([] as any);

    await service.create(user_id, {} as any);

    expect(repository.create).toHaveBeenCalled();
  });

  it('user should be able to read all reviews of a single product', async () => {
    const product_id = '123';
    const params = {} as any;

    await service.findAll(product_id, params);

    expect(repository.findAllByProductId).toHaveBeenCalled();
  });

  it('user should not be able to remove a review of a different user', async () => {
    const user_id = '123';
    const id = '111';
    const review = {
      user_id: '3312',
    } as any;

    jest.spyOn(repository, 'findById').mockResolvedValueOnce(review);

    try {
      await service.remove(user_id, id);
    } catch (error) {
      expect(error.status).toBe(403);
    }
  });

  it('user should be able to remove their reviews', async () => {
    const user_id = '123';
    const id = '111';
    const review = {
      user_id: '123',
    } as any;

    jest.spyOn(repository, 'findById').mockResolvedValueOnce(review);

    await service.remove(user_id, id);

    expect(repository.delete).toHaveBeenCalled();
  });
});
