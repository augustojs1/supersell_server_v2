import {
  Body,
  Controller,
  HttpStatus,
  ParseFilePipeBuilder,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, File } from '@nest-lab/fastify-multer';

import { UsersService } from './users.service';
import { GetCurrentUserDecorator } from '../auth/decorators';
import { CurrentUser } from '../auth/types';
import { UpdateUserProfileDto } from './dto';
import { AccessTokenGuard } from '../auth/guards';
@UseGuards(AccessTokenGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('profile')
  public async updateProfile(
    @GetCurrentUserDecorator() user: CurrentUser,
    @Body() data: UpdateUserProfileDto,
  ): Promise<void> {
    return this.usersService.updateProfile(user.sub, data);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('profile/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  public async updateAvatar(
    @GetCurrentUserDecorator() user: CurrentUser,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 50000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    avatar_file: File,
  ): Promise<void> {
    return this.usersService.updateAvatar(user.sub, avatar_file);
  }
}
