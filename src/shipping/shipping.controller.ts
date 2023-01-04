import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {AdminGuard, AtGuard} from 'src/common/guards';
import {Shipment} from './entities/shipment/shipment.entity';
import {ShippingService} from './shipping.service';

@Controller('/api/shipping')
export class ShippingController {
  constructor(private shippingService: ShippingService) {}

  @UseGuards(AtGuard, AdminGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  async createShipment(@Body() shipment: Shipment): Promise<Shipment> {
    return this.shippingService.createShipment(shipment);
  }

  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/')
  async getShipments(): Promise<Shipment[]> {
    return this.shippingService.getShipments();
  }

  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async getShipment(@Param('id') id: number): Promise<Shipment> {
    return this.shippingService.getShipment(id);
  }

  @UseGuards(AtGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('/:id')
  async deleteShipment(@Param('id') id: number): Promise<any> {
    return this.shippingService.deleteShipment(id);
  }

  @UseGuards(AtGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  @Put('/')
  async updateShipment(@Body() shipment: Shipment): Promise<Shipment> {
    return this.shippingService.updateShipment(shipment);
  }
}
