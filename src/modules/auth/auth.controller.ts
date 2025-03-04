import { Controller, Body, Post, UseGuards, Get, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import {
  SignUpDto,
  SignInDto,
  SignInSuccesDto,
  UserProfileDto,
  ResetPasswordDto,
} from './dto';
import { AccessTokenGuard } from './guards';
import { GetCurrentUserDecorator } from './decorators';
import { CurrentUser } from './types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Create an account.',
  })
  @ApiResponse({
    status: 201,
    description: 'Succesfully created a new account.',
  })
  @ApiResponse({
    status: 400,
    description: 'User with this email already exists!',
  })
  @Post('local/sign-up')
  public async signUpLocal(
    @Body() signUpDto: SignUpDto,
  ): Promise<SignInSuccesDto> {
    return await this.authService.signUpLocal(signUpDto);
  }

  @ApiOperation({
    summary: 'Sign in with an existent account.',
  })
  @ApiResponse({
    status: 201,
    description: 'Succesfully authenticated.',
  })
  @ApiResponse({
    status: 403,
    description: 'Incorrect email or password',
  })
  @Post('local/sign-in')
  public async signInLocal(
    @Body() signInDto: SignInDto,
  ): Promise<SignInSuccesDto> {
    return await this.authService.signInLocal(signInDto);
  }

  @ApiOperation({
    summary: 'Return profile from authenticated user.',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Succesfully returned an authenticated profile.',
  })
  @UseGuards(AccessTokenGuard)
  @Get('local/me')
  public async getMe(
    @GetCurrentUserDecorator() user: CurrentUser,
  ): Promise<UserProfileDto> {
    return await this.authService.getMe(user.sub);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('/request-password-reset')
  public async requestPasswordReset(
    @GetCurrentUserDecorator() user: CurrentUser,
  ) {
    await this.authService.requestPasswordReset(user.sub);
  }

  @Post('/reset-password')
  public async resetPassword(@Body() dto: ResetPasswordDto): Promise<void> {
    await this.authService.resetPassword(dto);
  }
}
