import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AdminGuard, AtGuard, MailGuard } from 'src/common/guards';
import { Review } from '../entities/review/review.entity';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
    constructor(private reviewsService: ReviewsService) {}

  @UseGuards(AtGuard, MailGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  async createReviews(@Body() reviews: Review[]): Promise<Review[]> {
    return this.reviewsService.createReviews(reviews);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/')
  async getReviews(): Promise<Review[]> {
    return this.reviewsService.getReviews();
  }

  @HttpCode(HttpStatus.OK)
  @Get('/:productId')
  async getReview(@Param('productId') id: number): Promise<Review> {
    return this.reviewsService.getReview(id);
  }

  @UseGuards(AtGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('/:id')
  async deleteReview(@Param('id') id: number): Promise<any> {
    return this.reviewsService.deleteReview(id);
  }

  @UseGuards(AtGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  @Put('/')
  async updateReview(@Body() review: Review): Promise<Review> {
    return this.reviewsService.updateReview(review);
  }
}
