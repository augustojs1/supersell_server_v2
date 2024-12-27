import { Module } from '@nestjs/common';

import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { CountriesRepository } from './countries.repository';
import { AddressRepository } from './address.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [AddressController],
  imports: [AuthModule],
  providers: [AddressService, CountriesRepository, AddressRepository],
})
export class AddressModule {}
