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
import { ApiParam, ApiQuery } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { GetCurrentUserDecorator } from '../auth/decorators';
import { CurrentUser } from '../auth/types';
import { UpdateUserProfileDto } from './dto';
import { AccessTokenGuard } from '../auth/guards';
import { ProductsService } from '../products/products.service';
import { PaginationParamsDto } from '../common/dto';
import { DepartmentProductsDTO } from '../products/dto';
import { UserProfileDto } from '../auth/dto';

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
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    description: 'Result page',
  })
  @ApiQuery({
    name: 'size',
    required: false,
    example: 5,
    description: 'Limit of results per page',
  })
  @ApiParam({
    name: 'user_id',
    description: 'Id of user owned products',
  })
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

  @Get(':user_id/profile')
  public async getProfile(
    @Param('user_id') user_id: string,
  ): Promise<UserProfileDto> {
    return await this.usersService.findUserProfile(user_id);
  }
}
