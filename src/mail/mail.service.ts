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
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async sendOrderConfirmation(order: Order, user: User) {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'New Order Confirmed',
        template: './buy_confirmation',
        context: {
          order,
          name: user.name,
          price: order.discount ? (order.total - order.shipment.price - ((order.total - order.shipment.price) / 100 *
          order.discount.percent)) : order.total - order.shipment.price,
          products: order.products.reduce(
            (acc: Array<any>, cur: OrderProduct) => [
              ...acc,
              {
                ...cur.product,
                // imageUrl: cur.product.images.find(
                //   (img: ProductImage) => img.type === 'MAIN',
                // ),
                count: cur.count,
              },
            ],
            [],
          ),
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
}
