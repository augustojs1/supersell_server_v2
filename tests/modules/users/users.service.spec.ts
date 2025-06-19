import { Test, TestingModule } from '@nestjs/testing';

import { UsersRepository } from '@/modules/users/users.repository';
import { UsersService } from '@/modules/users/users.service';
import { IStorageService } from '@/infra/storage/istorage.service.interface';

describe('UsersService', () => {
  let service: UsersService;
  let repository: UsersRepository;
  let storageService: IStorageService;

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
            updateAvatar: jest.fn(),
          },
        },
        {
          provide: IStorageService,
          useValue: {
            upload: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UsersRepository>(UsersRepository);
    storageService = module.get<IStorageService>(IStorageService);
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

  it('should be able to update their profile avatar', async () => {
    // Arrange
    const user = {
      avatar_url: null,
    } as any;

    jest.spyOn(repository, 'findUserWithProfile').mockResolvedValueOnce(user);

    // Act
    await service.updateAvatar('123', {} as any);

    // Assert
    expect(storageService.upload).toHaveBeenCalled();
    expect(repository.updateAvatar).toHaveBeenCalled();
  });
});
