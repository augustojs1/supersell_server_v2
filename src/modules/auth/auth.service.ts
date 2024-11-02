import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { HashProvider } from './providers/hash.providers';
import { Token } from './types/token.type';
import { SignInDto, SignUpDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly hashProvider: HashProvider,
  ) {}

  private async hashData(data: string): Promise<string> {
    return await this.hashProvider.hashData(data);
  }

  public async getToken(userId: string, email: string): Promise<Token> {
    const accessToken = await this.jwtService.signAsync(
      {
        sub: userId,
        email: email,
      },
      {
        secret: this.configService.get<string>('jwt.secret'),
        expiresIn: this.configService.get<string>('jwt.expire_time'),
      },
    );

    return {
      access_token: accessToken,
    };
  }

  public async signUpLocal(signUpDto: SignUpDto): Promise<Token> {
    const user = await this.usersService.findUserByEmail(signUpDto.email);

    if (user) {
      throw new HttpException(
        'User with this email already exists!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await this.hashData(signUpDto.password);

    const newUser = await this.usersService.create({
      first_name: signUpDto.first_name,
      last_name: signUpDto.last_name,
      email: signUpDto.email,
      password: hashedPassword,
    });

    const token = await this.getToken(newUser.id, newUser.email);

    return token;
  }

  public async signInLocal(signInDto: SignInDto): Promise<Token> {
    const user = await this.usersService.findUserByEmail(signInDto.email);

    if (!user) {
      throw new HttpException(
        'Incorrect email or password',
        HttpStatus.FORBIDDEN,
      );
    }

    const passwordMatches = await this.hashProvider.compare(
      signInDto.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new HttpException(
        'Incorrect email or password',
        HttpStatus.FORBIDDEN,
      );
    }

    const token = await this.getToken(user.id, user.email);

    return token;
  }

  public async getMe(userId: string): Promise<string> {
    const user = await this.usersService.findById(userId);

    return user.id;
  }
}
