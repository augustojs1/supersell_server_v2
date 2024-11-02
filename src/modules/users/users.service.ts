import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async create(createUserDto: CreateUserDto): Promise<any> {
    const user = await this.usersRepository.findUserByEmail(
      createUserDto.email,
    );

    if (user.length > 0) {
      throw new HttpException(
        'User with this email already exists!',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.usersRepository.create(createUserDto);
  }
}
