import { User } from "src/auth/user/user.entity";
import { Model } from "src/models/model.entity";
import { Product } from "src/products/product/product.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, (user) => user.cart)
    user: User;

    @Column({ default: 0 })
    totalCost: number;

    @OneToMany(() => CartProduct, (product) => product.cart, {
        cascade: true
    })
    products: CartProduct[]
}

@Entity()
export class CartProduct {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    localID: string;

    @Column()
    count: number;

    @OneToOne(() => Model, {
        cascade: true
    })
    @JoinColumn()
    model: Model;

    @OneToOne(() => Product, {
        cascade: true
    })
    @JoinColumn()
    product: Product;

    @ManyToOne(() => Cart, (cart) => cart.products)
    cart: Cart;
}