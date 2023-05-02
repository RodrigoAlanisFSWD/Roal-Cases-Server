import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {Address} from 'src/shipping/entities/address/address.entity';
import {GetCurrentUser} from 'src/common/decorators';
import {AdminGuard, AtGuard, MailGuard} from 'src/common/guards';
import {Order} from './order/order.entity';
import {OrdersService} from './orders.service';

@Controller('/api/orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @UseGuards(AtGuard, MailGuard)
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async createOrder(
    @GetCurrentUser('sub') userId: number,
    @Body() order: Order,
  ): Promise<Order> {
    return this.ordersService.createOrder(userId, order);
  }

  @UseGuards(AtGuard)
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getOrders(@GetCurrentUser('sub') userId: number): Promise<Order[]> {
    return this.ordersService.getOrders(userId);
  }

  @UseGuards(AtGuard, MailGuard)
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getOrder(
    @GetCurrentUser('sub') userId: number,
    @Param('id') id: number,
  ): Promise<Order> {
    return this.ordersService.getOrder(userId, id);
  }

  @UseGuards(AtGuard, AdminGuard)
  @Put('/')
  @HttpCode(HttpStatus.OK)
  async updateOrder(@Body() order: Order): Promise<Order> {
    return this.ordersService.updateOrder(order);
  }

  @UseGuards(AtGuard, MailGuard)
  @Delete('/clean')
  async cleanOrders(@GetCurrentUser('sub') userId: number): Promise<any> {
    return this.ordersService.cleanOrders(userId);
  }

  @UseGuards(AtGuard, MailGuard)
  @Post('/setUrl')
  async setShipmentUrl(@Body() order: Order): Promise<Order> {
    return this.ordersService.setShipmentUrl(order)
  }
}
