import { Address } from "src/shipping/entities/address/address.entity";
import { Shipment } from "src/shipping/entities/shipment/shipment.entity";
import { Discount } from "src/shopping/entities/discount/discount.entity";
import { OrderReview } from "src/sells/entities/orderReview/orderReview.entity";
import { Review } from "src/sells/entities/review/review.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/auth/user/user.entity";

@Entity()
export class Sell {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    total: number;

    @ManyToOne(() => Address, {
        cascade: true,
      })
    address: Address;

    @ManyToOne(() => Shipment, {
        cascade: true,
      })
    shipment: Shipment;

    @Column({ default: 'none' })
    created_at: string;

    @ManyToOne(() => Discount, {
        cascade: true,
        nullable: true
    })
    discount: Discount

    @OneToMany(() => Review, (review) => review.sell, {
        cascade: true,
      })
    productReviews: Review[] 

    @OneToOne(() => OrderReview, {
        cascade: true,
      })
    @JoinColumn()
    review: OrderReview

    @ManyToOne(() => User, (user) => user.sells)
    user: User;
}