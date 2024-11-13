import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 0 })
  @IsPositive()
  quantity: number;

  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  is_used: boolean;

  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  is_in_stock: boolean;
}
