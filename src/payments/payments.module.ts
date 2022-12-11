import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CartModule } from 'src/cart/cart.module';
import { OrdersModule } from 'src/orders/orders.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [ConfigModule, CartModule, OrdersModule],
  controllers: [PaymentsController],
  providers: [PaymentsService]
})
export class PaymentsModule {}
