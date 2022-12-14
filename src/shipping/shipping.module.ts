import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address/address.entity';
import { AddressService } from './entities/address/address.service';
import { AddressesController } from './addresses/addresses.controller';
import { AddressesService } from './addresses/addresses.service';
import { ShippingController } from './shipping.controller';
import { ShippingService } from './shipping.service';
import { ShipmentService } from './entities/shipment/shipment.service';
import { Shipment } from './entities/shipment/shipment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Address, Shipment])],
  controllers: [ShippingController, AddressesController],
  providers: [ShippingService, AddressesService, AddressService, ShipmentService]
})
export class ShippingModule {}
