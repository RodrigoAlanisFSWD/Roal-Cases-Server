import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { Cart } from 'src/cart/cart.entity';
import { AdminGuard, AtGuard, MailGuard } from 'src/common/guards';
import { Order } from 'src/orders/order/order.entity';
import { OrderReview } from './entities/orderReview/orderReview.entity';
import { Review } from './entities/review/review.entity';
import { Sell } from './entities/sell/sell.entity';
import { SellsService } from './sells.service';

export interface CreateSellDTO {
    order: Order;
    reviews: Review[];
    orderReview: OrderReview;
}

@Controller('/api/sells')
export class SellsController {

    constructor(
        private sellsService: SellsService
    ) { }

    @Post("/")
    @HttpCode(HttpStatus.CREATED)
    async createSell(@Body() data: CreateSellDTO): Promise<Sell> {
        return this.sellsService.createSell(data)
    }

    @UseGuards(AtGuard, MailGuard)
    @Get("/")
    async getSells(): Promise<Sell[]> {
        return this.sellsService.getSells()
    }

    @UseGuards(AtGuard, MailGuard)
    @Get("/:id")
    async getSell(@Param("id") id: number): Promise<Sell> {
        return this.sellsService.getSell(id)
    }

}
