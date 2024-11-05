import { Body, Controller, Patch, UseGuards } from '@nestjs/common';

import { UsersService } from './users.service';
import { GetCurrentUserDecorator } from '../auth/decorators';
import { CurrentUser } from '../auth/types';
import { UpdateUserProfileDto } from './dto';
import { AccessTokenGuard } from '../auth/guards';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AccessTokenGuard)
  @Patch('profile')
  public async updateProfile(
    @GetCurrentUserDecorator() user: CurrentUser,
    @Body() data: UpdateUserProfileDto,
  ): Promise<void> {
    return this.usersService.updateProfile(user.sub, data);
  }
}
