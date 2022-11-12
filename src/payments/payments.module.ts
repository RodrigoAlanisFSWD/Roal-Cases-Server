import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CartModule } from 'src/cart/cart.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [ConfigModule, CartModule],
  controllers: [PaymentsController],
  providers: [PaymentsService]
})
export class PaymentsModule {}
