import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {FindOneOptions, Repository} from 'typeorm';
import { OrderReview } from './orderReview.entity';

@Injectable()
export class OrderReviewService {
  constructor(
    @InjectRepository(OrderReview)
    private orderReviewRepo: Repository<OrderReview>,
  ) {}

  async saveOrderReview(orderReview: OrderReview): Promise<OrderReview> {
    return this.orderReviewRepo.save(orderReview);
  }

  async getOrderReviews(): Promise<OrderReview[]> {
    return this.orderReviewRepo.find();
  }

  async getOrderReview(id: number): Promise<OrderReview> {
    return this.orderReviewRepo.findOne({
      where: {
        id,
      },
    });
  }

  async findOrderReview(options: FindOneOptions<OrderReview>): Promise<OrderReview> {
    return this.orderReviewRepo.findOne(options)
  }

  async deleteOrderReview(id: number): Promise<any> {
    return this.orderReviewRepo.delete(id);
  }
}
