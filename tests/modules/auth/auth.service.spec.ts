import { JwtService } from '@nestjs/jwt';

import { AuthService } from '@/modules/auth/auth.service';
import { HashProvider } from '@/modules/auth/providers/hash.providers';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '@/modules/users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let configService: ConfigService;
  let hashProvider: HashProvider;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: HashProvider,
          useValue: {
            hashData: jest.fn(),
            compare: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findUserByEmail: jest.fn(),
            createUserAndShoppingCart: jest.fn(),
            findUserProfile: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    hashProvider = module.get<HashProvider>(HashProvider);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should not be able to create an user with a non unique email', async () => {
    const dto = {} as any;

    jest
      .spyOn(usersService, 'findUserByEmail')
      .mockResolvedValueOnce({} as any);

    try {
      await service.signUpLocal(dto);
    } catch (error) {
      expect(error.status).toBe(400);
    }
  });

  it('should be able to sign up a user and generate JWT', async () => {
    const dto = {} as any;

    jest.spyOn(usersService, 'findUserByEmail').mockResolvedValueOnce(null);

    jest.spyOn(service, 'hashData').mockResolvedValueOnce('321312');
    jest
      .spyOn(usersService, 'createUserAndShoppingCart')
      .mockResolvedValueOnce({
        id: 'asdaasd',
        email: '32312',
      } as any);

    jest.spyOn(service, 'getToken').mockResolvedValueOnce({} as any);

    await service.signUpLocal(dto);

    expect(service.getToken).toHaveBeenCalled();
  });

  it('should not be able to sign in a non existent user', async () => {
    const dto = {} as any;

    jest.spyOn(usersService, 'findUserByEmail').mockResolvedValueOnce(null);

    try {
      await service.signInLocal(dto);
    } catch (error) {
      expect(error.status).toBe(403);
    }
  });

  it('should not be able to sign in a user with their incorrect password', async () => {
    const dto = {
      password: '1312312',
    } as any;

    jest.spyOn(usersService, 'findUserByEmail').mockResolvedValueOnce({
      password: '31231212',
    } as any);

    jest.spyOn(hashProvider, 'compare').mockResolvedValueOnce(false);

    try {
      await service.signInLocal(dto);
    } catch (error) {
      expect(error.status).toBe(403);
    }
  });

  it('should be able sign in a user', async () => {
    const dto = {
      password: '1312312',
    } as any;

    jest.spyOn(usersService, 'findUserByEmail').mockResolvedValueOnce({
      password: '31231212',
    } as any);

    jest.spyOn(hashProvider, 'compare').mockResolvedValueOnce(true);

    jest.spyOn(service, 'getToken').mockResolvedValueOnce({} as any);

    await service.signInLocal(dto);

    expect(service.getToken).toHaveBeenCalled();
  });

  it('should be able to return a user profile', async () => {
    const userId = '123';

    await service.getMe(userId);

    expect(usersService.findUserProfile).toHaveBeenCalled();
  });
});
