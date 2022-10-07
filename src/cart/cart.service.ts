import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/auth/user/user.service';
import { Repository } from 'typeorm';
import { Cart, CartProduct } from './cart.entity';

@Injectable()
export class CartService {

    constructor(
        @InjectRepository(Cart)
        private cartRepo: Repository<Cart>,
        @InjectRepository(CartProduct)
        private cartProductRepo: Repository<CartProduct>,
        private userService: UserService
    ) { }

    async getCart(userId: number): Promise<Cart> {
        const user = await this.userService.getUserWithCart(userId)

        return user.cart
    }

    async addProductToCart(product: CartProduct, userId: number): Promise<Cart> {
        const newProduct = await this.cartProductRepo.save(product)
        const cart = (await this.userService.getUserWithCart(userId)).cart

        cart.products.push(newProduct)

        await this.cartRepo.save(cart);

        return cart;
    }

    async removeProductFromCart(product: CartProduct, userId: number): Promise<Cart> {
        const cart = (await this.userService.getUserWithCart(userId)).cart

        cart.products.filter((p: CartProduct) => p.id !== product.id);

        await this.cartRepo.save(cart);

        await this.cartProductRepo.delete(product);

        return cart;
    }

    async editProductInCart(product: CartProduct, action: string, payload: number): Promise<CartProduct> {
        switch(action) {
            case "ADD":
                product.count += payload;
            break;
            case "LESS":
                product.count -= payload
            break;  
            default:
                return product
        }

        await this.cartProductRepo.save(product)

        return product
    }

}
