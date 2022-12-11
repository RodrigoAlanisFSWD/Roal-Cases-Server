import { Controller, Get, HttpCode, HttpStatus, Param, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { GetCurrentUser } from 'src/common/decorators';
import { AtGuard } from 'src/common/guards';
import { Order } from 'src/orders/order/order.entity';
import Stripe from 'stripe';
import { PaymentsService } from './payments.service';

@Controller('/api/payments')
export class PaymentsController {

    constructor(
        private paymentService: PaymentsService
    ) { }

    @Get("/:cart")
    @HttpCode(HttpStatus.CREATED)
    async createPayment(@Param("cart") id: number): Promise<any> {

        return this.paymentService.createSession(id)
    }

    @UseGuards(AtGuard)
    @Post("/finish/:session")
    @HttpCode(HttpStatus.OK)
    async finishPayment(@GetCurrentUser("sub") userId: number, @Param("session") session: string): Promise<Order> {
        return this.paymentService.finishPayment(session, userId)
    }

}
