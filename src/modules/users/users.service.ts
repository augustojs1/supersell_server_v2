import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { File } from '@nest-lab/fastify-multer';

import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UserEntity } from './types';
import { UserProfileDto } from '../auth/dto';
import { UpdateUserProfileDto } from './dto';
import { IStorageService } from '@/infra/storage/istorage.service.interface';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly storageService: IStorageService,
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<any> {
    const user = await this.findUserByEmail(createUserDto.email);

    if (user) {
      throw new HttpException(
        'User with this email already exists!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const createdUser = await this.usersRepository.create(createUserDto);

    await this.usersRepository.createProfile(createdUser.id);

    return createdUser;
  }

  public async createProfile(id: string): Promise<void> {
    await this.usersRepository.createProfile(id);
  }

  public async findUserByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.usersRepository.findUserByEmail(email);

    return user;
  }

  public async findById(id: string): Promise<UserEntity | null> {
    const user = await this.usersRepository.findById(id);

    return user;
  }

  public async findUserProfile(id: string): Promise<UserProfileDto | null> {
    return await this.usersRepository.findUserWithProfile(id);
  }

  public async updateProfile(
    id: string,
    data: UpdateUserProfileDto,
  ): Promise<void> {
    return this.usersRepository.updateProfile(id, data);
  }

  public async updateAvatar(id: string, avatar_file: File): Promise<void> {
    this.logger.log(`Init update user ${id} avatar!`);

    const userProfile = await this.usersRepository.findUserWithProfile(id);

    if (userProfile.avatar_url) {
      const avatarKey = userProfile.avatar_url.split('.com/')[1];

      if (!avatarKey) {
        await this.storageService.remove(userProfile.avatar_url);
      } else {
        await this.storageService.remove(avatarKey);
      }
    }

    const path: string = `user_${id}/avatar`;

    const url = await this.storageService.upload(avatar_file, path);

    return this.usersRepository.updateAvatar(id, url);
  }

  public async findUserByIdElseThrow(user_id: string): Promise<void> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new HttpException(
        'User with this id does no exists!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async createUserAndShoppingCart(
    user: CreateUserDto,
  ): Promise<UserEntity> {
    await this.usersRepository.createUserAndShoppingCartTrx(user);

    return await this.findUserByEmail(user.email);
  }

  public async updateUserPassword(id: string, password: string): Promise<void> {
    await this.usersRepository.updateUserPaswordById(id, password);
  }
}
