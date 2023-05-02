import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {FindOneOptions, Repository} from 'typeorm';
import { Review } from './review.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepo: Repository<Review>,
  ) {}

  async saveReview(review: Review): Promise<Review> {
    return this.reviewRepo.save(review);
  }

  async getReviews(): Promise<Review[]> {
    return this.reviewRepo.find();
  }

  async getReview(id: number): Promise<Review> {
    return this.reviewRepo.findOne({
      where: {
        id,
      },
    });
  }

  async findReview(options: FindOneOptions<Review>): Promise<Review> {
    return this.reviewRepo.findOne(options)
  }

  async deleteReview(id: number): Promise<any> {
    return this.reviewRepo.delete(id);
  }
}
