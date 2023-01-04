import {Injectable} from '@nestjs/common';
import * as moment from 'moment';
import {AuthService} from 'src/auth/auth.service';
import {CartProduct} from 'src/cart/cart.entity';
import {CartService} from 'src/cart/cart.service';
import {MailService} from 'src/mail/mail.service';
import {Order, OrderStatus} from './order/order.entity';
import {OrderService} from './order/order.service';

@Injectable()
export class OrdersService {
  constructor(
    private orderService: OrderService,
    private cartService: CartService,
  ) {}

  async createOrder(userId: number, orderData: Order): Promise<Order> {
    try {
      const cart = await this.cartService.getCart(userId);
      const totalPrice =
        cart.products.reduce(
          (acc: number, cur: CartProduct) =>
            (acc += cur.product.price * cur.count),
          0,
        ) + orderData.shipment.price;

      const order: any = {
        total: totalPrice,
        status: OrderStatus.PAID,
        user: {
          id: userId,
        },
        products: [],
        address: orderData.address,
        shipment: orderData.shipment,
        discount: orderData.discount ? orderData.discount : null,
        created_at: moment().format('MMM Do YY'),
      };

      cart.products.forEach((product: CartProduct) => {
        const newProduct: any = {
          count: product.count,
          model: product.model,
          product: product.product,
        };

        order.products.push(newProduct);
      });

      await this.cartService.resetCart(userId);

      const newOrder = await this.orderService.saveOrder(order);

      return newOrder;
    } catch (error) {
      console.log(error);
    }
  }

  async getOrders(userId: number): Promise<Order[]> {
    return this.orderService.findOrders({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        user: true,
        products: true,
      },
    });
  }

  async getOrder(userId: number, id: number): Promise<Order> {
    return this.orderService.findOrder({
      where: {
        user: {
          id: userId,
        },
        id,
      },
      relations: {
        user: true,
        products: {
          model: true,
          product: {
            images: true,
          },
        },
        address: true,
        shipment: true,
        discount: true
      },
    });
  }

  async updateOrder(order: Order): Promise<Order> {
    return this.orderService.saveOrder(order);
  }

  async deleteOrder(order: Order): Promise<any> {
    return this.orderService.deleteOrder(order);
  }

  async cleanOrders(userId: number): Promise<any> {
    return this.orderService.cleanOrders(userId);
  }
}
