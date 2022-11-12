import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderService } from './order/order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, OrderProduct } from './order/order.entity';
import { CartModule } from 'src/cart/cart.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderProduct]), CartModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrderService]
})
export class OrdersModule {}
