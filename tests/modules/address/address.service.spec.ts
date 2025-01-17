import { Test, TestingModule } from '@nestjs/testing';

import { AddressRepository } from '@/modules/address/address.repository';
import { AddressService } from '@/modules/address/address.service';
import { CountriesRepository } from '@/modules/address/countries.repository';

describe('AddressService', () => {
  let service: AddressService;
  let repository: AddressRepository;
  let countriesRepository: CountriesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        {
          provide: AddressRepository,
          useValue: {
            findAllByUserIdAndType: jest.fn(),
            create: jest.fn(),
            findAllByUserId: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: CountriesRepository,
          useValue: {
            findByCode: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AddressService>(AddressService);
    repository = module.get<AddressRepository>(AddressRepository);
    countriesRepository = module.get<CountriesRepository>(CountriesRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should not create an address in a non existent country', async () => {
    const user_id = '123';
    const data = {} as any;

    jest.spyOn(countriesRepository, 'findByCode').mockResolvedValueOnce(null);

    try {
      await service.create(data, user_id);
    } catch (error) {
      expect(error.status).toBe(400);
    }
  });

  it('should be able to create an address', async () => {
    const user_id = '123';
    const data = {
      type: 'DELIVERY_ADDRESS',
    } as any;

    jest
      .spyOn(countriesRepository, 'findByCode')
      .mockResolvedValueOnce({} as any);

    await service.create(data, user_id);

    expect(repository.create).toHaveBeenCalled();
  });

  it('should be able to return all user address', async () => {
    const user_id = '123';

    await service.findAll(user_id);

    expect(repository.findAllByUserId).toHaveBeenCalled();
  });

  it('should not be able to update a non existent addres', async () => {
    const id = '111';
    const user_id = '123';
    const data = {} as any;

    jest.spyOn(repository, 'findById').mockResolvedValueOnce(null);

    try {
      await service.update(id, user_id, data);
    } catch (error) {
      expect(error.status).toBe(404);
    }
  });

  it('user should not be able to update a different user address', async () => {
    const id = '111';
    const user_id = '123';
    const data = {
      user_id: '111',
    } as any;

    jest
      .spyOn(repository, 'findById')
      .mockResolvedValueOnce({ user_id: '111' } as any);

    jest
      .spyOn(countriesRepository, 'findByCode')
      .mockResolvedValueOnce({} as any);

    try {
      await service.update(id, user_id, data);
    } catch (error) {
      expect(error.status).toBe(403);
    }
  });

  it('user should be able to update one of their address', async () => {
    const id = '111';
    const user_id = '123';
    const data = {} as any;

    jest
      .spyOn(repository, 'findById')
      .mockResolvedValueOnce({ user_id: '123' } as any);

    jest
      .spyOn(countriesRepository, 'findByCode')
      .mockResolvedValueOnce({} as any);

    await service.update(id, user_id, data);

    expect(repository.update).toHaveBeenCalled();
  });
});
