import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user/user.entity';
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

    async createCart(userId: number) {
        const user = await this.userService.getUserWithCart(userId);

        if (!user.cart) {
            const cart = this.cartRepo.create({
                user,
            })
    
            return this.cartRepo.save(cart)
        }

        return
    }

    async getCart(userId: number): Promise<Cart> {
        const cart = await this.cartRepo.findOne({
            where: {
                user: {
                    id: userId
                }
            },
            relations: {
                user: true,
                products: {
                    product: true
                }
            }
        })

        return cart
    }

    async addProductToCart(product: CartProduct, userId: number): Promise<Cart> {
        const user = await this.userService.getUserWithCart(userId)

        const cart = user.cart;

        const localID = `p-${product.product.id}-${product.product.name}-m-${product.model.id}-${product.model.name}` 
        
        const exists = cart.products.find((p: CartProduct) => p.localID === localID);

        if (exists) {
            exists.count += product.count;

            await this.cartProductRepo.save(exists)
        } else {
            const newProduct = await this.cartProductRepo.save(product)


            cart.products = [
                ...cart.products,
                newProduct,
            ]

            await this.cartRepo.save(cart);
        }

        return cart;
    }

    async removeProductFromCart(id: number, userId: number): Promise<Cart> {
        const cart = (await this.userService.getUserWithCart(userId)).cart

        cart.products.filter((p: CartProduct) => p.id !== id);

        await this.cartRepo.save(cart);

        await this.cartProductRepo.delete(id);

        return cart;
    }

    async editProductInCart(product: CartProduct, action: string, payload: any): Promise<CartProduct> {
        switch(action) {
            case "ADD":
                product.count += parseInt(payload);
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
