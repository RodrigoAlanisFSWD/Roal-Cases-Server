import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Order, OrderProduct, OrderStatus } from './order.entity';

@Injectable()
export class OrderService {

    constructor(
        @InjectRepository(Order)
        private orderRepo: Repository<Order>,
        @InjectRepository(OrderProduct)
        private orderProductRepo: Repository<OrderProduct>
    ) { }

    async saveOrder(order: Order): Promise<Order> {
        return this.orderRepo.save(order)
    }

    async findOrders(options: FindManyOptions<Order>): Promise<Order[]> {
        return this.orderRepo.find(options)
    }

    async findOrder(options: FindOneOptions<Order>): Promise<Order> {
        return this.orderRepo.findOne(options)
    }

    async deleteOrder(order: Order): Promise<any> {
        return this.orderRepo.delete(order.id)
    }

    async cleanOrders(userId: number): Promise<any> {
        return this.orderRepo.delete({
            user: {
                id: userId,
            },
            status: OrderStatus.NEW,
        })
    }

}
