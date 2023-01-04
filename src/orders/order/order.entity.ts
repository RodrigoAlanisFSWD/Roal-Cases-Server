import {Address} from 'src/shipping/entities/address/address.entity';
import {User} from 'src/auth/user/user.entity';
import {Model} from 'src/models/model.entity';
import {Product} from 'src/products/product/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {Shipment} from 'src/shipping/entities/shipment/shipment.entity';
import { Discount } from 'src/shopping/entities/discount/discount.entity';

export enum OrderStatus {
  PAID = 'PAID',
  NEW = 'NEW',
  CONFIRMED = 'CONFIRMED',
  FAILED = 'FAILED',
  DELIVERED = 'DELIVERED',
  FINISHED = 'FINISHED',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  total: number;

  @Column()
  status: OrderStatus;

  @ManyToOne(() => User, user => user.orders)
  user: User;

  @ManyToOne(() => Address)
  address: Address;

  @ManyToOne(() => Shipment)
  shipment: Shipment;

  @OneToMany(() => OrderProduct, orderProduct => orderProduct.order, {
    cascade: true,
  })
  products: OrderProduct[];

  @Column({default: 'none'})
  created_at: string;

  @ManyToOne(() => Discount, {
    cascade: true,
    nullable: true
  })
  discount: Discount

}

@Entity()
export class OrderProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  count: number;

  @ManyToOne(() => Model, {
    cascade: true,
  })
  @JoinColumn()
  model: Model;

  @ManyToOne(() => Product, {
    cascade: true,
  })
  @JoinColumn()
  product: Product;

  @ManyToOne(() => Order, order => order.products)
  order: Order;
}
