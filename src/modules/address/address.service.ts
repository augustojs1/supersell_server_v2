import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { CreateAddressDto, UpdateAddressDto } from './dto';
import { AddressRepository } from './address.repository';
import { CountriesRepository } from './countries.repository';
import { AddressType } from './enums';
import { AddressEntity } from './types';

@Injectable()
export class AddressService {
  constructor(
    private readonly addressRepository: AddressRepository,
    private readonly countriesRepository: CountriesRepository,
  ) {}

  public async create(
    data: CreateAddressDto,
    user_id: string,
  ): Promise<AddressEntity> {
    const country = await this.countriesRepository.findByCode(
      data.country_code,
    );

    if (!country) {
      throw new HttpException(
        'Country with this code does not exists!',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (data.type === AddressType.PERSONAL_ADDRESS) {
      const address = await this.addressRepository.findAllByUserIdAndType(
        user_id,
        AddressType.PERSONAL_ADDRESS,
      );

      if (address.length > 0) {
        throw new HttpException(
          'User already have a personal address!',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    return await this.addressRepository.create(data, user_id);
  }

  public async findAll(user_id: string): Promise<AddressEntity[]> {
    return await this.addressRepository.findAllByUserId(user_id);
  }

  public async findByIdElseThrow(id: string): Promise<AddressEntity> {
    const address = await this.addressRepository.findById(id);

    if (!address) {
      throw new HttpException(
        'Address with this id does not exists!',
        HttpStatus.NOT_FOUND,
      );
    }

    return address;
  }

  public async findByUserAddressIdElseThrow(id: string) {
    const address = await this.addressRepository.findUserAddressById(id);

    if (!address) {
      throw new HttpException(
        'Address with this id does not exists!',
        HttpStatus.NOT_FOUND,
      );
    }

    return address;
  }

  public checkUserIsOwnerElseThrow(
    address_user_id: string,
    user_id: string,
  ): void {
    if (address_user_id !== user_id) {
      throw new ForbiddenException();
    }
  }

  public async update(
    id: string,
    user_id: string,
    data: UpdateAddressDto,
  ): Promise<void> {
    const address = await this.findByIdElseThrow(id);

    const country = await this.countriesRepository.findByCode(
      data.country_code,
    );

    if (!country) {
      throw new HttpException(
        'Country with this code does not exists!',
        HttpStatus.BAD_REQUEST,
      );
    }

    this.checkUserIsOwnerElseThrow(address.user_id, user_id);

    await this.addressRepository.update(address.id, data);
  }

  public async remove(id: string, user_id: string): Promise<void> {
    const address = await this.findByIdElseThrow(id);

    await this.checkUserIsOwnerElseThrow(address.user_id, user_id);

    if (address.type === AddressType.PERSONAL_ADDRESS) {
      throw new HttpException(
        'User can not delete a personal address!',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.addressRepository.delete(address.id, user_id);
  }
}
