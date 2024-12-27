import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { AddressService } from './address.service';
import { AddressDTO, CreateAddressDto, UpdateAddressDto } from './dto';
import { AccessTokenGuard } from '../auth/guards';
import { GetCurrentUserDecorator } from '../auth/decorators';
import { CurrentUser } from '../auth/types';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  public async create(
    @Body() createAddressDto: CreateAddressDto,
    @GetCurrentUserDecorator() user: CurrentUser,
  ): Promise<AddressDTO> {
    return await this.addressService.create(createAddressDto, user.sub);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  public async findAll(
    @GetCurrentUserDecorator() user: CurrentUser,
  ): Promise<AddressDTO[]> {
    return await this.addressService.findAll(user.sub);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
    @GetCurrentUserDecorator() user: CurrentUser,
  ): Promise<void> {
    await this.addressService.update(id, user.sub, updateAddressDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  public async remove(
    @Param('id') id: string,
    @GetCurrentUserDecorator() user: CurrentUser,
  ): Promise<void> {
    return await this.addressService.remove(id, user.sub);
  }
}
