import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/auth/user/user.service';
import { CartService } from 'src/cart/cart.service';
import { calcTax } from 'src/common/utils/functions';
import { Stripe } from 'stripe';

@Injectable()
export class PaymentsService {
    private stripe: Stripe;

    constructor(
        private config: ConfigService,
        private cartService: CartService
    ) {
        this.stripe = new Stripe("sk_test_51LyNkyKPetfkQCPTULboJTU5KLygsDBuZIBUiaS2L1b4qnS8SOwkjiyT3vgjnPMQf8sN7Rpkwp6MOjel5Hph6esi00QxaW0vv7", {
            apiVersion: "2022-08-01"
        })
    }

    async createPayment(id: number): Promise<Stripe.Response<Stripe.PaymentIntent>> {
        const { products } = await this.cartService.getCartFromId(id)

        let sumAmount = 75;

        products.forEach(({ count, product }) => {
            sumAmount = sumAmount + (product.price * count)
        })

        sumAmount += calcTax(sumAmount)

        return this.stripe.paymentIntents.create({
            amount: sumAmount * 100,
            currency: "MXN",
            automatic_payment_methods: {enabled: true},

        })
    }
}
