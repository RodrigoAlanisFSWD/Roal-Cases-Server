import { Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { GetCurrentUser } from 'src/common/decorators';
import { AtGuard } from 'src/common/guards';
import Stripe from 'stripe';
import { PaymentsService } from './payments.service';

@Controller('/api/payments')
export class PaymentsController {

    constructor(
        private paymentService: PaymentsService
    ) { }

    @Get("/:cart")
    @HttpCode(HttpStatus.CREATED)
    async createPayment(@Param("cart") id: number): Promise<Stripe.Response<Stripe.PaymentIntent>> {
        return this.paymentService.createPayment(id)
    }

}
