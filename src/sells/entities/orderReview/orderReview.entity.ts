import { Order } from "src/orders/order/order.entity";
import { Sell } from "src/sells/entities/sell/sell.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class OrderReview {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: false })
    shipping: boolean;

    @Column({ default: false })
    condition: boolean;

    @Column({ default: false })
    order: boolean;

    @Column({ default: false })
    app: boolean;

    @Column({ nullable: true })
    extra: string;

    @OneToOne(() => Sell, (sell) => sell.review)
    sell: Sell
}