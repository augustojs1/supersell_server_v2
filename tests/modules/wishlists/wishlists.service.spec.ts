import { Test, TestingModule } from '@nestjs/testing';

import { WishlistsRepository } from '@/modules/wishlists/wishlists.repository';
import { WishlistsService } from '@/modules/wishlists/wishlists.service';

describe('WishlistsService', () => {
  let service: WishlistsService;
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
          },
        },
      ],
    }).compile();

    service = module.get<WishlistsService>(WishlistsService);
    repository = module.get<WishlistsRepository>(WishlistsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
