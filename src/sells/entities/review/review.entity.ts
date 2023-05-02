import { User } from "src/auth/user/user.entity";
import { Product } from "src/products/product/product.entity";
import { Sell } from "src/sells/entities/sell/sell.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    stars: number

    @Column()
    count: number

    @ManyToOne(() => Product)
    product: Product

    @ManyToOne(() => User, {
        cascade: true
    })
    user: User

    @Column({default: 'none'})
    created_at: string;

    @ManyToOne(() => Sell, (sell) => sell.productReviews)
    sell: Sell
}