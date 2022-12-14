import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartModule } from 'src/cart/cart.module';
import { OrdersModule } from 'src/orders/orders.module';
import { DiscountsController } from './discounts/discounts.controller';
import { DiscountsService } from './discounts/discounts.service';
import { Discount } from './entities/discount/discount.entity';
import { PaymentsController } from './payments/payments.controller';
import { PaymentsService } from './payments/payments.service';

@Module({
    imports: [ConfigModule, CartModule, OrdersModule, TypeOrmModule.forFeature([Discount])],
    controllers: [PaymentsController, DiscountsController],
    providers: [PaymentsService, DiscountsService]
})
export class ShoppingModule {}
