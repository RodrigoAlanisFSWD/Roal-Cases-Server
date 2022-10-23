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
                    product: {
                        images: true,
                    },
                    model: true
                },
            }
        })

        return cart
    }

    async addProductToCart(product: CartProduct, userId: number): Promise<Cart> {
            const user = await this.userService.getUserWithCart(userId)

            const cart = user.cart;
    
            const localID = `p-${product.product.id}-${product.product.name.split(" ").join("")}-m-${product.model.id}-${product.model.name.split(" ").join("")}` 
            
            const exists = cart.products.find((p: CartProduct) => p.localID === localID);
    
            if (exists) {
                exists.count += product.count;
    
                await this.cartProductRepo.save(exists)
            } else {
                console.log(product, localID)
                const newProduct = await this.cartProductRepo.save({
                    ...product,
                    localID
                })
    
                console.log(newProduct) 
    
                cart.products.push(newProduct)    
            }

            cart.totalCost = cart.products.reduce((acc: any, cur: CartProduct) => acc += cur.product.price * cur.count, 0)

            await this.cartRepo.save(cart);
    
            return cart;     
    }

    async removeProductFromCart(id: number, userId: number): Promise<Cart> {
        const cart = (await this.userService.getUserWithCart(userId)).cart

        await this.cartProductRepo.delete(id)

        cart.products = cart.products.filter((p: CartProduct) => p.id != id);

        cart.totalCost = cart.products.reduce((acc: any, cur: CartProduct) => acc += cur.product.price * cur.count, 0)

        await this.cartRepo.save(cart);

        return cart;
    }

    async editProductInCart(product: CartProduct, newCount: number, userId: number): Promise<Cart> {
        product.count = newCount

        await this.cartProductRepo.save(product)

        const cart = await this.getCart(userId);

        cart.totalCost = cart.products.reduce((acc: any, cur: CartProduct) => acc += cur.product.price * cur.count, 0)

        await this.cartRepo.save(cart);

        return cart
    }

}
