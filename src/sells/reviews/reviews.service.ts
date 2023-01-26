import { Injectable } from '@nestjs/common';
import { Review } from '../entities/review/review.entity';
import { ReviewService } from '../entities/review/review.service';

@Injectable()
export class ReviewsService {
    constructor(private reviewService: ReviewService) {}

  async createReviews(reviews: Review[]): Promise<Review[]> {
    reviews.map((review: Review) => {
      return this.reviewService.saveReview(review)
    })

    return reviews;
  }

  async getReviews(): Promise<Review[]> {
    return this.reviewService.getReviews();
  }

  async getReview(id: number): Promise<Review> {
    return this.reviewService.findReview({
        where: {
            product: {
                id,
            }
        },
        relations: {
            product: true
        }
    });
  }

  async updateReview(review: Review): Promise<Review> {
    return this.reviewService.saveReview(review);
  }

  async deleteReview(id: number): Promise<any> {
    return this.reviewService.deleteReview(id);
  }
}
