import moment from "moment";
import { User } from "src/auth/user/user.entity";
import { Model } from "src/models/model.entity";
import { Product } from "src/products/product/product.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

export enum OrderStatus {
    NEW = "NEW",
    CONFIRMED = "CONFIRMED",
    FAILED = "FAILED",
    DELIVERED = "DELIVERED",
    FINISHED = "FINISHED"
}

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    total: number;

    @Column()
    status: OrderStatus;

    @ManyToOne(() => User, (user) => user.orders)
    user: User;

    @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order, {
        cascade: true
    })
    products: OrderProduct[];

    @Column({ default: "none" })
    created_at: string;

    @BeforeInsert()
    insertCreated() {
        this.created_at = moment().format("MMM Do YY")
    }
}

@Entity()
export class OrderProduct {
    @PrimaryGeneratedColumn()
    id: number;

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

    @ManyToOne(() => Order, (order) => order.products)
    order: Order
}