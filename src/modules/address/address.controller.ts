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
import { AddressDTO, CreateAddressDto } from './dto';
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

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
  //   return this.addressService.update(+id, updateAddressDto);
  // }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  public async remove(
    @Param('id') id: string,
    @GetCurrentUserDecorator() user: CurrentUser,
  ): Promise<void> {
    return await this.addressService.remove(id, user.sub);
  }
}
