import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { GetCurrentUser } from 'src/common/decorators';
import { AdminGuard, AtGuard } from 'src/common/guards';
import { Order } from './order/order.entity';
import { OrdersService } from './orders.service';

@Controller('/api/orders')
export class OrdersController {

    constructor(
        private ordersService: OrdersService
    ) { }

    @UseGuards(AtGuard)
    @Post("/")
    @HttpCode(HttpStatus.CREATED)
    async createOrder(@GetCurrentUser("sub") userId: number): Promise<Order> {
        return this.ordersService.createOrder(userId)
    }

    @UseGuards(AtGuard)
    @Get("/")
    @HttpCode(HttpStatus.OK)
    async getOrders(@GetCurrentUser("sub") userId: number): Promise<Order[]> {
        return this.ordersService.getOrders(userId)
    }

    @UseGuards(AtGuard)
    @Get("/:id")
    @HttpCode(HttpStatus.OK)
    async getOrder(@GetCurrentUser("sub") userId: number, @Param("id") id: number): Promise<Order> {
        return this.ordersService.getOrder(userId, id)
    }

    @UseGuards(AtGuard, AdminGuard)
    @Put("/")
    @HttpCode(HttpStatus.OK)
    async updateOrder(@Body() order: Order): Promise<Order> {
        return this.ordersService.updateOrder(order)
    }

}
