import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Product} from '../product/product.entity';

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  imageUrl: string;

  @ManyToOne(() => Product, product => product.images)
  product: Product;
}
