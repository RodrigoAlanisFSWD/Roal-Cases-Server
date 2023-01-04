import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CartService } from 'src/cart/cart.service';
import { calcTax } from 'src/common/utils/functions';
import { OrderStatus } from 'src/orders/order/order.entity';
import { OrdersService } from 'src/orders/orders.service';
import { ProductImage } from 'src/products/image/image.entity';
import { ShippingService } from 'src/shipping/shipping.service';
import { Stripe } from 'stripe';
import { DiscountsService } from '../discounts/discounts.service';
import { CreatePaymentDTO } from './payments.controller';

export interface UpdatePaymentDTO {
  cartId: number;
  payment: string;
  shipment: number;
}

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    private cartService: CartService,
    private shippingService: ShippingService,
    private discountsService: DiscountsService
  ) {
    this.stripe = new Stripe(
      'sk_test_51LyNkyKPetfkQCPTULboJTU5KLygsDBuZIBUiaS2L1b4qnS8SOwkjiyT3vgjnPMQf8sN7Rpkwp6MOjel5Hph6esi00QxaW0vv7',
      {
        apiVersion: '2022-08-01',
      },
    );
  }

  async createPayment(
    data: CreatePaymentDTO
  ): Promise<any> {
    const { products } = await this.cartService.getCart(data.userId)
    const { price } = await this.shippingService.getShipment(data.shipmentId)
    let discount;

    if (data.discountId > 0) {
      discount = await this.discountsService.getDiscount(data.discountId)
    }

    let sumAmount = price;

    products.forEach(({ count, product }) => {
      sumAmount = sumAmount + product.price * count;
    });

    if (data.discountId > 0 && discount) {
      sumAmount -= (sumAmount / 100) * discount.percent
    }

    const tax = (sumAmount / 100) * 3

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: sumAmount * 100,
      currency: 'mxn',
    });

    return {
      client_secret: paymentIntent.client_secret,
      tax,
    };
  }
}
