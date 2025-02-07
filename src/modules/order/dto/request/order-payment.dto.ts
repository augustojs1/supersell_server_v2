import { Type } from 'class-transformer';
import { PaymentMethods } from '../../enums';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

class CreditCardMethodData {
  @IsNotEmpty()
  @IsString()
  @MinLength(16)
  @MaxLength(16)
  card_number: string;

  @IsNotEmpty()
  @IsString()
  card_holder: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(5)
  expiration_date: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(3)
  cvv: string;
}

export class OrderPaymentDto {
  @IsNotEmpty()
  @IsEnum(PaymentMethods)
  method: PaymentMethods;
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreditCardMethodData)
  paymentDetails: CreditCardMethodData;
}
