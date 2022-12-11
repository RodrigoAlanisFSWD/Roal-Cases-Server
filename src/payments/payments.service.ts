import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/auth/user/user.service';
import { CartProduct } from 'src/cart/cart.entity';
import { CartService } from 'src/cart/cart.service';
import { calcTax } from 'src/common/utils/functions';
import { OrderStatus } from 'src/orders/order/order.entity';
import { OrderService } from 'src/orders/order/order.service';
import { OrdersService } from 'src/orders/orders.service';
import { ProductImage } from 'src/products/image/image.entity';
import { Stripe } from 'stripe';

@Injectable()
export class PaymentsService {
    private stripe: Stripe;

    constructor(
        private config: ConfigService,
        private cartService: CartService,
        private ordersService: OrdersService
    ) {
        this.stripe = new Stripe("sk_test_51LyNkyKPetfkQCPTULboJTU5KLygsDBuZIBUiaS2L1b4qnS8SOwkjiyT3vgjnPMQf8sN7Rpkwp6MOjel5Hph6esi00QxaW0vv7", {
            apiVersion: "2022-08-01"
        })
    }

    async createPayment(cartId: number): Promise<Stripe.Response<Stripe.PaymentIntent>> {
        const { products, user } = await this.cartService.getCartFromId(cartId)

        let sumAmount = 75;

        products.forEach(({ count, product }) => {
            sumAmount = sumAmount + (product.price * count)
        })

        sumAmount += calcTax(sumAmount)

        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: sumAmount * 100,
            currency: "mxn",
            automatic_payment_methods: { enabled: true }
        })

        return paymentIntent
    }

    async createSession(id: number): Promise<Stripe.Checkout.Session> {
        const { products, user } = await this.cartService.getCartFromId(id)

        let sumAmount = 75;

        products.forEach(({ count, product }) => {
            sumAmount = sumAmount + (product.price * count)
        })

        sumAmount += calcTax(sumAmount)
        const items = products.reduce((acc: any, cur) => {
            return [...acc, {
                price_data: {
                    currency: "MXN",
                    product_data: {
                        name: cur.product.name,
                        images: [cur.product.images.find((image: ProductImage) => image.type === "MAIN").imageUrl]
                    },
                    unit_amount: cur.product.price * 100,
                },
                quantity: cur.count,
            }]
        }, [])

        const session = await this.stripe.checkout.sessions.create({
            customer_email: user.email,
            line_items: items,
            mode: "payment",
            success_url: 'http://localhost:3000/shopping/after-payment?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'http://localhost:3000/shopping/confirmation',
            submit_type: 'pay',
        })

        return session
    }

    async finishPayment(session: string, userId: number): Promise<any> {
        const order = await this.ordersService.getOrderFromSession(session, userId)
        
        order.status = OrderStatus.PAID;

        await this.ordersService.updateOrder(order)

        return order;
    }

    async cancelPayment(session: string, userId: number): Promise<any> {
        const order = await this.ordersService.getOrderFromSession(session, userId)
        
        await this.ordersService.deleteOrder(order)

        return order
    }
}
