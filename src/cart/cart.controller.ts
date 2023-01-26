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
import {GetCurrentUser} from 'src/common/decorators';
import {AtGuard, MailGuard} from 'src/common/guards';
import {Product} from 'src/products/product/product.entity';
import {Cart, CartProduct} from './cart.entity';
import {CartService} from './cart.service';

@Controller('/api/cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @UseGuards(AtGuard)
  @Get('/')
  @HttpCode(HttpStatus.OK)
  getProfile(@GetCurrentUser('sub') userId: number): Promise<Cart> {
    return this.cartService.getCart(userId);
  }

  @UseGuards(AtGuard)
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  createCart(@GetCurrentUser('sub') userId: number): Promise<Cart> {
    return this.cartService.createCart(userId);
  }

  @UseGuards(AtGuard, MailGuard)
  @Post('/add')
  @HttpCode(HttpStatus.CREATED)
  addProduct(
    @GetCurrentUser('sub') userId: number,
    @Body() product: CartProduct,
  ): Promise<Cart> {
    return this.cartService.addProductToCart(product, userId);
  }

  @UseGuards(AtGuard, MailGuard)
  @Delete('/:id')
  @HttpCode(HttpStatus.CREATED)
  removeProduct(
    @GetCurrentUser('sub') userId: number,
    @Param('id') id: number,
  ): Promise<Cart> {
    return this.cartService.removeProductFromCart(id, userId);
  }

  @UseGuards(AtGuard, MailGuard)
  @Put('/:count')
  @HttpCode(HttpStatus.CREATED)
  editProduct(
    @Body() product: CartProduct,
    @Param('count') count: number,
    @GetCurrentUser('sub') userId: number,
  ): Promise<Cart> {
    return this.cartService.editProductInCart(product, count, userId);
  }

  @UseGuards(AtGuard, MailGuard)
  @Delete('/all')
  @HttpCode(HttpStatus.OK)
  deleteCart(@GetCurrentUser('sub') userId: number): Promise<any> {
    return this.cartService.deleteCart(userId);
  }
}
