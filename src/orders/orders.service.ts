import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { Address } from 'src/shipping/entities/address/address.entity';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/auth/user/user.service';
import { CartProduct } from 'src/cart/cart.entity';
import { CartService } from 'src/cart/cart.service';
import { calcTax } from 'src/common/utils/functions';
import { MailService } from 'src/mail/mail.service';
import { Order, OrderStatus } from './order/order.entity';
import { OrderService } from './order/order.service';

@Injectable()
export class OrdersService {

    constructor(
        private orderService: OrderService,
        private cartService: CartService,
        private mailService: MailService,
        private authService: AuthService
    ) { }

    async createOrder(userId: number, address: Address): Promise<Order> {
        try {
            const cart = await this.cartService.getCart(userId)
            const totalPrice = cart.products.reduce((acc: number, cur: CartProduct) => acc += cur.product.price * cur.count, 0) + 75
            const tax = calcTax(totalPrice)

            const order: any = {
                total: Math.round(totalPrice + tax),
                status: OrderStatus.PAID,
                user: {
                    id: userId
                },
                products: [],
                address,
                created_at: moment().format("MMM Do YY"),
            }

            cart.products.forEach((product: CartProduct) => {
                const newProduct: any = {
                    count: product.count,
                    model: product.model,
                    product: product.product,
                }

                order.products.push(newProduct)
            })

            await this.cartService.resetCart(userId)

            const newOrder = await this.orderService.saveOrder(order)

            return newOrder
        } catch (error) {
            console.log(error)
        }

    }

    async getOrders(userId: number): Promise<Order[]> {
        return this.orderService.findOrders({
            where: {
                user: {
                    id: userId
                }
            },
            relations: {
                user: true,
                products: true,
            }
        })
    }

    async getOrder(userId: number, id: number): Promise<Order> {
        return this.orderService.findOrder({
            where: {
                user: {
                    id: userId
                },
                id,
            },
            relations: {
                user: true,
                products: {
                    model: true,
                    product: {
                        images: true
                    },
                },
                address: true
            }
        })
    }

    async updateOrder(order: Order): Promise<Order> {
        return this.orderService.saveOrder(order)
    }

    async getOrderFromSession(session: string, userId: number) {
        return this.orderService.findOrder({
            where: {
                sessionId: session,
                user: {
                    id: userId
                }
            },
            relations: {
                user: true,
            }
        })
    }

    async deleteOrder(order: Order): Promise<any> {
        return this.orderService.deleteOrder(order)
    }

    async cleanOrders(userId: number): Promise<any> {
        return this.orderService.cleanOrders(userId)
    }

}
