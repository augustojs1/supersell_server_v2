import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class UpdateItemQuantityDTO {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;
}
