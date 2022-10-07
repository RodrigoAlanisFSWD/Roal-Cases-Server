import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/auth/user/user.service';
import { CartController } from './cart.controller';
import { Cart, CartProduct } from './cart.entity';
import { CartService } from './cart.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartProduct]),
    UserService
  ],
  controllers: [CartController],
  providers: [CartService]
})
export class CartModule {}
