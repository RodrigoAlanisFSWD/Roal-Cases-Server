import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Body,
} from '@nestjs/common';

import {PaymentsService} from './payments.service';

export interface CreatePaymentDTO {
  shipmentId: number;
  userId: number;
  discountId: number;
}

@Controller('/api/payments')
export class PaymentsController {
  constructor(private paymentService: PaymentsService) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async createPayment(@Body() data: CreatePaymentDTO): Promise<any> {
    return this.paymentService.createPayment(data);
  }
}
