import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { AddressType } from '../../enums';

export class CreateAddressDto {
  @IsNotEmpty()
  @IsEnum(AddressType)
  type: AddressType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  alias: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  complement: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  number: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  street: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  neighborhood: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  district: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  postalcode: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  city: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2)
  country_code: string;
}
