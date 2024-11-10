import { Transform } from 'class-transformer';

import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  department_id: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: string;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber({ maxDecimalPlaces: 0 })
  @IsPositive()
  quantity: string;

  @IsNotEmpty()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  is_used: string;
}
