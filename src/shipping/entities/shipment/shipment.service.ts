import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Shipment} from './shipment.entity';

@Injectable()
export class ShipmentService {
  constructor(
    @InjectRepository(Shipment)
    private shipmentRepo: Repository<Shipment>,
  ) {}

  async saveShipment(address: any): Promise<Shipment> {
    return this.shipmentRepo.save(address);
  }

  async getShipments(): Promise<Shipment[]> {
    return this.shipmentRepo.find();
  }

  async getShipment(id: number): Promise<Shipment> {
    return this.shipmentRepo.findOne({
      where: {
        id,
      },
    });
  }

  async deleteShipment(id: number): Promise<any> {
    return this.shipmentRepo.delete(id);
  }
}
