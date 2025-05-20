import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { HashProvider } from './providers/hash.providers';
import { Token } from './types/token.type';
import { ResetPasswordDto, SignInDto, SignUpDto, UserProfileDto } from './dto';
import { IEmailEventsPublisher } from '@/infra/events/publishers/emails/iemail-events-publisher.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly hashProvider: HashProvider,
    private readonly emailEventsPublisher: IEmailEventsPublisher,
  ) {}

  public async hashData(data: string): Promise<string> {
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

    const newUser = await this.usersService.createUserAndShoppingCart({
      first_name: signUpDto.first_name,
      last_name: signUpDto.last_name,
      username: signUpDto.username,
      email: signUpDto.email,
      password: hashedPassword,
    });

    await this.usersService.createProfile(newUser.id);

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

  public async getMe(userId: string): Promise<UserProfileDto> {
    return await this.usersService.findUserProfile(userId);
  }

  public async requestPasswordReset(id: string) {
    const user = await this.usersService.findById(id);

    const token = await this.jwtService.signAsync(
      {
        email: user.email,
      },
      {
        secret: this.configService.get<string>('jwt.secret'),
        expiresIn: this.configService.get<string>('jwt.expire_time'),
      },
    );

    this.emailEventsPublisher.emitEmailPasswordResetMessage({
      first_name: user.first_name,
      email: user.email,
      reset_token: token,
    });
  }

  private async decodeToken(token: string): Promise<string> {
    try {
      const payload = await this.jwtService.verifyAsync(token.trim(), {
        secret: this.configService.get<string>('jwt.secret'),
      });

      return payload['email'];
    } catch {
      throw new UnauthorizedException();
    }
  }

  public async resetPassword(dto: ResetPasswordDto) {
    const email = await this.decodeToken(dto.token);

    const user = await this.usersService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const hashedPassword = await this.hashData(dto.password);

    await this.usersService.updateUserPassword(user.id, hashedPassword);
  }
}
