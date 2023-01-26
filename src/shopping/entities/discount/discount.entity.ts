import {Product} from 'src/products/product/product.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum DiscountType {
  FOR_FINAL_PRICE = 'FOR_FINAL_PRICE',
  FOR_PRODUCTS = 'FOR_PRODUCTS',
}

@Entity()
export class Discount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  code: string;

  @Column()
  type: DiscountType;

  @Column({ default: 'none' })
  expirationDate: string;

  @ManyToMany(() => Product, {
    cascade: true,
  })
  @JoinTable()
  products: Product[];

  @Column()
  percent: number;
}
