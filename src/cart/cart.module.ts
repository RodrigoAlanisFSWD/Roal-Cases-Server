import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AuthModule} from 'src/auth/auth.module';
import {CartController} from './cart.controller';
import {Cart, CartProduct} from './cart.entity';
import {CartService} from './cart.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartProduct]), AuthModule],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
