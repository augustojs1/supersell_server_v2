import { IsEnum, IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderByOptionsEnum } from '../enums/order-by-options.enum';

export class PaginationParamsSortableDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @IsInt()
  size?: number;

  @IsOptional()
  @IsEnum(OrderByOptionsEnum)
  orderBy?: string;
}
