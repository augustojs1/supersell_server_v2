import { Injectable } from '@nestjs/common';

import { CreateAddressDto } from './dto';
import { AddressRepository } from './address.repository';
import { CountriesRepository } from './countries.repository';

@Injectable()
export class AddressService {
  constructor(
    private readonly addressRepository: AddressRepository,
    private readonly countriesRepository: CountriesRepository,
  ) {}

  create(createAddressDto: CreateAddressDto) {
    console.log('createAddressDto::', createAddressDto);
  }

  findAll() {
    return `This action returns all address`;
  }

  findOne(id: number) {
    return `This action returns a #${id} address`;
  }

  // update(id: number, updateAddressDto: UpdateAddressDto) {
  //   return `This action updates a #${id} address`;
  // }

  remove(id: number) {
    return `This action removes a #${id} address`;
  }
}
