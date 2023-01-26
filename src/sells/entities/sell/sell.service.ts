import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {FindManyOptions, FindOneOptions, Repository} from 'typeorm';
import { Sell } from './sell.entity';

@Injectable()
export class SellService {
  constructor(
    @InjectRepository(Sell)
    private sellRepo: Repository<Sell>,
  ) {}

  async saveSell(sell: Sell): Promise<Sell> {
    return this.sellRepo.save(sell);
  }

  async getSells(): Promise<Sell[]> {
    return this.sellRepo.find();
  }

  async getSell(id: number): Promise<Sell> {
    return this.sellRepo.findOne({
      where: {
        id,
      },
    });
  }

  async findSell(options: FindOneOptions<Sell>): Promise<Sell> {
    return this.sellRepo.findOne(options)
  }

  async findSells(options: FindManyOptions<Sell>): Promise<Sell[]> {
    return this.sellRepo.find(options)
  }

  async deleteSell(id: number): Promise<any> {
    return this.sellRepo.delete(id);
  }
}
