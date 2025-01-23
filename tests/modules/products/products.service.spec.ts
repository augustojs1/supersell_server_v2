import { Test, TestingModule } from '@nestjs/testing';

import { DepartmentsService } from '@/modules/departments/departments.service';
import { ProductsRepository } from '@/modules/products/products.repository';
import { ProductsService } from '@/modules/products/products.service';
import { ProductsImagesService } from '@/modules/products_images/products_images.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: ProductsRepository;
  let departmentsService: DepartmentsService;
  let productImagesService: ProductsImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductsRepository,
          useValue: {
            findByName: jest.fn(),
            findBySkuAndUserId: jest.fn(),
            create: jest.fn(),
            findByParentDepartmentId: jest.fn(),
            createItemAndUpdateShoppingCartValueTrx: jest.fn(),
            findByDepartmentId: jest.fn(),
            findByUserId: jest.fn(),
            findById: jest.fn(),
            updateProduct: jest.fn(),
            deleteProduct: jest.fn(),
            findAllByName: jest.fn(),
            findByIdWithImages: jest.fn(),
            updateQuantity: jest.fn(),
            setProductIsInStock: jest.fn(),
          },
        },
        {
          provide: DepartmentsService,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: ProductsImagesService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<ProductsRepository>(ProductsRepository);
    departmentsService = module.get<DepartmentsService>(DepartmentsService);
    productImagesService = module.get<ProductsImagesService>(
      ProductsImagesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw an error when trying to create a product with duplicate name', async () => {
    const user_id = '123';
    const data = {} as any;
    const product_images = {} as any;

    jest.spyOn(repository, 'findByName').mockResolvedValueOnce({} as any);

    try {
      await service.create(user_id, data, product_images);
    } catch (error) {
      expect(error.status).toBe(400);
    }
  });

  it('should throw an error when trying to create a product with duplicate SKU', async () => {
    const user_id = '123';
    const data = {} as any;
    const product_images = {} as any;

    jest.spyOn(repository, 'findByName').mockResolvedValueOnce(null);

    jest
      .spyOn(repository, 'findBySkuAndUserId')
      .mockResolvedValueOnce({} as any);

    try {
      await service.create(user_id, data, product_images);
    } catch (error) {
      expect(error.status).toBe(400);
    }
  });

  it('should throw an error when trying to create a product in a non existent department', async () => {
    const user_id = '123';
    const data = {} as any;
    const product_images = {} as any;

    jest.spyOn(repository, 'findByName').mockResolvedValueOnce(null);

    jest.spyOn(repository, 'findBySkuAndUserId').mockResolvedValueOnce(null);

    jest.spyOn(departmentsService, 'findById').mockResolvedValueOnce(null);

    try {
      await service.create(user_id, data, product_images);
    } catch (error) {
      expect(error.status).toBe(400);
    }
  });

  it('should be able to create a product and product images', async () => {
    const user_id = '123';
    const data = {} as any;
    const product_images = {
      thumbnail_image: [{ path: '123' }],
    } as any;

    jest.spyOn(repository, 'findByName').mockResolvedValueOnce(null);

    jest.spyOn(repository, 'findBySkuAndUserId').mockResolvedValueOnce(null);

    jest.spyOn(departmentsService, 'findById').mockResolvedValueOnce({
      parent_department_id: '321',
    } as any);

    jest.spyOn(repository, 'create').mockResolvedValueOnce({
      id: '2123',
    } as any);

    await service.create(user_id, data, product_images);

    expect(repository.create).toHaveBeenCalled();
    expect(productImagesService.create).toHaveBeenCalled();
  });

  it('should throw an error when trying to delete a non existent product', async () => {
    const user_id = '123';
    const product_id = '111';

    jest.spyOn(repository, 'findById').mockResolvedValueOnce(null);

    try {
      await service.delete(user_id, product_id);
    } catch (error) {
      expect(error.status).toBe(400);
    }
  });

  it('should throw an error when trying to delete a different user product', async () => {
    const user_id = '123';
    const product_id = '111';

    jest.spyOn(repository, 'findById').mockResolvedValueOnce({
      user_id: '123',
    } as any);

    jest.spyOn(repository, 'findById').mockResolvedValueOnce({
      user_id: '123',
    } as any);

    try {
      await service.delete(user_id, product_id);
    } catch (error) {
      expect(error.status).toBe(403);
    }
  });

  it('should be able to delete a product', async () => {
    const user_id = '123';
    const product_id = '111';

    jest.spyOn(repository, 'findById').mockResolvedValueOnce({
      user_id: '123',
    } as any);

    jest.spyOn(repository, 'findById').mockResolvedValueOnce({
      user_id: '123',
    } as any);

    await service.delete(user_id, product_id);

    expect(repository.deleteProduct).toHaveBeenCalled();
  });

  it('should be able to find products by their names', async () => {
    const name = 'product name';

    await service.findByName(name);

    expect(repository.findAllByName).toHaveBeenCalled();
  });

  it('should be able to return a single product', async () => {
    const product_id = '123';

    jest.spyOn(repository, 'findById').mockResolvedValueOnce({} as any);

    await service.findByIdWithImages(product_id);

    expect(repository.findByIdWithImages).toHaveBeenCalled();
  });

  it('should throw an error when trying to update a non existent product', async () => {
    const user_id = '312';
    const product_id = '123';
    const data = {} as any;

    jest.spyOn(repository, 'findById').mockResolvedValueOnce(null);

    try {
      await service.updateProduct(user_id, product_id, data);
    } catch (error) {
      expect(error.status).toBe(400);
    }
  });

  it('should throw an error when trying to update a product from a different user', async () => {
    const user_id = '312';
    const product_id = '123';
    const data = {} as any;

    jest.spyOn(repository, 'findById').mockResolvedValueOnce({
      id: '123',
    } as any);

    jest.spyOn(repository, 'findById').mockResolvedValueOnce({
      id: '123',
      user_id: '312',
    } as any);

    try {
      await service.updateProduct(user_id, product_id, data);
    } catch (error) {
      expect(error.status).toBe(400);
    }
  });

  it('should be able to update a product', async () => {
    const user_id = '312';
    const product_id = '123';
    const data = {} as any;

    jest.spyOn(repository, 'findById').mockResolvedValueOnce({
      id: '123',
    } as any);

    jest.spyOn(repository, 'findById').mockResolvedValueOnce({
      id: '123',
      user_id: '312',
    } as any);

    await service.updateProduct(user_id, product_id, data);

    expect(repository.updateProduct).toHaveBeenCalled();
  });
});
