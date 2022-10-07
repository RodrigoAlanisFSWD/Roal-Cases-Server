import { User } from "src/auth/user/user.entity";
import { Product } from "src/products/product/product.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, (user) => user.cart)
    user: User;

    @ManyToMany(() => CartProduct)
    @JoinTable()
    products: CartProduct[]
}

@Entity()
export class CartProduct {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    count: number;

    @OneToOne(() => Product)
    @JoinColumn()
    product: Product;
}