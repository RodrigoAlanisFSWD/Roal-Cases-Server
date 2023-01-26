import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from 'src/orders/orders.module';
import { OrdersService } from 'src/orders/orders.service';
import { ReviewsService } from 'src/sells/reviews/reviews.service';
import { OrderReview } from './entities/orderReview/orderReview.entity';
import { OrderReviewService } from './entities/orderReview/orderReview.service';
import { Review } from './entities/review/review.entity';
import { ReviewService } from './entities/review/review.service';
import { Sell } from './entities/sell/sell.entity';
import { SellService } from './entities/sell/sell.service';
import { ReviewsController } from './reviews/reviews.controller';
import { SellsController } from './sells.controller';
import { SellsService } from './sells.service';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Sell, OrderReview]), OrdersModule],
  controllers: [SellsController, ReviewsController],
  providers: [SellsService, ReviewsService, ReviewService, SellService, OrderReviewService],
})
export class SellsModule {}
