import { Test, TestingModule } from '@nestjs/testing';

import { UsersRepository } from '@/modules/users/users.repository';
import { UsersService } from '@/modules/users/users.service';

describe('UsersService', () => {
  let service: UsersService;
  let repository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            createUserAndShoppingCartTrx: jest.fn(),
            findUserByEmail: jest.fn(),
            updateProfile: jest.fn(),
            findUserWithProfile: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to create user and their shopping cart', async () => {
    // Arrange
    const user = {
      email: 'email@test.com',
    };

    // Act
    await service.createUserAndShoppingCart(user as any);

    // Assert
    expect(repository.createUserAndShoppingCartTrx).toHaveBeenCalled();
  });

  it('should be able to update its own profile', async () => {
    // Arrange
    const id = '123';
    const data = {} as any;

    // Act
    await service.updateProfile(id, data);

    // Assert
    expect(repository.updateProfile).toHaveBeenCalled();
  });

  it('should be able to read their a user profile', async () => {
    // Arrage
    const id = '123';

    // Act
    await service.findUserProfile(id);

    // Assert
    expect(repository.findUserWithProfile).toHaveBeenCalled();
  });
});
