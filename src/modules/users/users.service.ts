import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './types';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async create(createUserDto: CreateUserDto): Promise<any> {
    const user = await this.findUserByEmail(createUserDto.email);

    if (user) {
      throw new HttpException(
        'User with this email already exists!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const createdUser = await this.usersRepository.create(createUserDto);

    return createdUser;
  }

  public async findUserByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.usersRepository.findUserByEmail(email);

    return user;
  }

  public async findById(id: string): Promise<UserEntity | null> {
    const user = await this.usersRepository.findById(id);

    return user;
  }
}
