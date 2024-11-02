import { Controller, Body, Post, UseGuards, Get } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignUpDto, SignInDto, SignInSuccesDto } from './dto';
import { AccessTokenGuard } from './guards';
import { GetCurrentUserDecorator } from './decorators';
import { CurrentUser } from './types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('local/sign-up')
  public async signUpLocal(
    @Body() signUpDto: SignUpDto,
  ): Promise<SignInSuccesDto> {
    return await this.authService.signUpLocal(signUpDto);
  }

  @Post('local/sign-in')
  public async signInLocal(
    @Body() signInDto: SignInDto,
  ): Promise<SignInSuccesDto> {
    return await this.authService.signInLocal(signInDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('local/me')
  public async getMe(@GetCurrentUserDecorator() user: CurrentUser) {
    console.log('user::', user);

    return true;
  }
}
