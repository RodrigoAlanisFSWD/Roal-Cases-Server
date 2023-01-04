import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {FindOneOptions, Repository} from 'typeorm';
import {Discount} from './discount.entity';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(Discount)
    private discountRepo: Repository<Discount>,
  ) {}

  async saveDiscount(discount: Discount): Promise<Discount> {
    return this.discountRepo.save(discount);
  }

  async getDiscounts(): Promise<Discount[]> {
    return this.discountRepo.find();
  }

  async getDiscount(id: number): Promise<Discount> {
    return this.discountRepo.findOne({
      where: {
        id,
      },
    });
  }

  async findDiscount(options: FindOneOptions): Promise<Discount> {
    return this.discountRepo.findOne(options)
  }

  async deleteDiscount(id: number): Promise<any> {
    return this.discountRepo.delete(id);
  }
}
