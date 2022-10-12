import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { GetCurrentUser } from 'src/common/decorators';
import { AtGuard } from 'src/common/guards';
import { Product } from 'src/products/product/product.entity';
import { Cart, CartProduct } from './cart.entity';
import { CartService } from './cart.service';

@Controller('/api/cart')
export class CartController {

    constructor(
        private cartService: CartService
    ) { }

    @UseGuards(AtGuard)
    @Get("/")
    @HttpCode(HttpStatus.OK)
    getProfile(@GetCurrentUser('sub') userId: number): Promise<Cart> {
        return this.cartService.getCart(userId)
    }

    @UseGuards(AtGuard)
    @Post("/")
    @HttpCode(HttpStatus.CREATED)
    createCart(@GetCurrentUser("sub") userId: number): Promise<Cart> {
        return this.cartService.createCart(userId);
    }

    @UseGuards(AtGuard)
    @Post("/add")
    @HttpCode(HttpStatus.CREATED)
    addProduct(@GetCurrentUser('sub') userId: number, @Body() product: CartProduct): Promise<Cart> {
        return this.cartService.addProductToCart(product, userId)
    }

    @UseGuards(AtGuard)
    @Delete("/:id")
    @HttpCode(HttpStatus.CREATED)
    removeProduct(@GetCurrentUser('sub') userId: number, @Param("id") id: number): Promise<Cart> {
        return this.cartService.removeProductFromCart(id, userId)
    }

    @UseGuards(AtGuard)
    @Put("/:action/:payload")
    @HttpCode(HttpStatus.CREATED)
    editProduct(@Body() product: CartProduct, @Param("action") action: string, @Param("payload") payload: number): Promise<CartProduct> {
        return this.cartService.editProductInCart(product, action, payload);
    }


}

