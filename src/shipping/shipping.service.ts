import {Injectable} from '@nestjs/common';
import {Shipment} from './entities/shipment/shipment.entity';
import {ShipmentService} from './entities/shipment/shipment.service';

@Injectable()
export class ShippingService {
  constructor(private shipmentService: ShipmentService) {}

  async createShipment(shipment: Shipment): Promise<Shipment> {
    return this.shipmentService.saveShipment(shipment);
  }

  async getShipments(): Promise<Shipment[]> {
    return this.shipmentService.getShipments();
  }

  async getShipment(id: number): Promise<Shipment> {
    return this.shipmentService.getShipment(id);
  }

  async updateShipment(shipment: Shipment): Promise<Shipment> {
    return this.shipmentService.saveShipment(shipment);
  }

  async deleteShipment(id: number): Promise<any> {
    return this.shipmentService.deleteShipment(id);
  }
}
