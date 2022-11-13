import { Injectable } from '@nestjs/common';
import { UserService } from 'src/auth/user/user.service';
import { CartProduct } from 'src/cart/cart.entity';
import { CartService } from 'src/cart/cart.service';
import { calcTax } from 'src/common/utils/functions';
import { Order, OrderStatus } from './order/order.entity';
import { OrderService } from './order/order.service';

@Injectable()
export class OrdersService {

    constructor(
        private orderService: OrderService,
        private cartService: CartService
    ) { }

    async createOrder(userId: number): Promise<Order> {
        const cart = await this.cartService.getCart(userId)
        const totalPrice = cart.products.reduce((acc: number, cur: CartProduct) => acc += cur.product.price * cur.count, 0) + 75
        const tax = calcTax(totalPrice)

        const order: any = {
            total: Math.round(totalPrice + tax),
            status: OrderStatus.NEW,
            user: {
                id: userId
            },
            products: [],
        }

        cart.products.forEach((product: CartProduct) => {
            const newProduct: any = {
                count: product.count,
                model: product.model,
                product: product.product,
            }

            order.products.push(newProduct)
        })

        console.log(order)

        return this.orderService.saveOrder(order)
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
                }
            }
        })
    }

    async updateOrder(order: Order): Promise<Order> {
        return this.orderService.saveOrder(order)
    }

}
