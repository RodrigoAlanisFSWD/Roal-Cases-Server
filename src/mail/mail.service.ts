import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from 'src/auth/user/user.entity';
import { Order, OrderProduct } from 'src/orders/order/order.entity';
import { ProductImage } from 'src/products/image/image.entity';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) { }

    async sendEmailConfirmation(user: User, code: string) {
        try {
            await this.mailerService.sendMail({
                to: user.email,
                subject: 'Welcome To Roal Cases! Confirm Your Email',
                template: './confirmation',
                context: {
                    name: user.name,
                    code,
                }
            })
        } catch (error) {
            console.log(error)
        }

    }

    async sendOrderConfirmation(order: Order, user: User) {
        try {
            console.log( order.products.reduce((acc: Array<any>, cur: OrderProduct) => [...acc, {
                ...cur.product,
                imageUrl: cur.product.images.find((img: ProductImage) => img.type === "MAIN"),
                count: cur.count,
            }], []))
            await this.mailerService.sendMail({
                to: user.email,
                subject: 'New Order Confirmed',
                template: "./order-confirmation",
                context: {
                    ...order,
                    name: user.name,
                    products: order.products.reduce((acc: Array<any>, cur: OrderProduct) => [...acc, {
                        ...cur.product,
                        imageUrl: cur.product.images.find((img: ProductImage) => img.type === "MAIN"),
                        count: cur.count,
                    }], [])
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
}
