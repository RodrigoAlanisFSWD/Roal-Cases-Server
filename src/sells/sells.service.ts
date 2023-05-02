import { Injectable } from '@nestjs/common';
import { Sell } from './entities/sell/sell.entity';
import { SellService } from './entities/sell/sell.service';
import { CreateSellDTO } from './sells.controller';
import * as moment from 'moment';
import { ReviewService } from './entities/review/review.service';
import { Review } from './entities/review/review.entity';
import { OrderReviewService } from './entities/orderReview/orderReview.service';
import { OrdersService } from 'src/orders/orders.service';

@Injectable()
export class SellsService {

    constructor(
        private sellService: SellService,
        private reviewService: ReviewService,
        private orderReviewService: OrderReviewService,
        private ordersService: OrdersService
    ) { }

    async createSell(data: CreateSellDTO): Promise<Sell> {

        const { order, orderReview, reviews } = data;

        const date = moment().format('MMM Do YY')

        const sell: Sell | any = {
            created_at: date,
            discount: order.discount ? order.discount : null,
            shipment: order.shipment,
            total: order.total,
            user: order.user
        }

        const createdSell = await this.sellService.saveSell(sell)

        await this.orderReviewService.saveOrderReview({
            ...orderReview,
            sell: createdSell,
        })

        reviews.forEach(async (review: Review) => {
            await this.reviewService.saveReview({
                ...review,
                sell: createdSell,
                created_at: date,
                user: order.user
            })
        })

        await this.ordersService.deleteOrder(order)

        return sell;
    }

    async getSells(): Promise<Sell[]> {
        return this.sellService.findSells({
            relations: {
                user: true
            }
        })
    }

    async getSell(id: number): Promise<Sell> {
        return this.sellService.findSell({
            where: {
                id,
            },
            relations: {
                discount: true,
                review: true,
                shipment: true,
                user: true,
                productReviews: {
                    product: {
                        images: true
                    }
                },
            }
        })
    }

}
