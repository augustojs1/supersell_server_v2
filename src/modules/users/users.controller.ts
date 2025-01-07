import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Query,
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
import { ProductsService } from '../products/products.service';
import { PaginationParamsDto } from '../common/dto';
import { DepartmentProductsDTO } from '../products/dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) {}

  @UseGuards(AccessTokenGuard)
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

  @Get(':user_id/products')
  public async findUserProducts(
    @Param('user_id') user_id: string,
    @Query() paginationParams: PaginationParamsDto,
  ): Promise<DepartmentProductsDTO> {
    await this.usersService.findUserByIdElseThrow(user_id);

    return await this.productsService.findUserProducts(
      user_id,
      paginationParams,
    );
  }
}
