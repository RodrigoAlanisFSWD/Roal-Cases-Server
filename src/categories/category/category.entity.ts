import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {Product} from '../../products/product/product.entity';
import {IsInt, IsNotEmpty, IsString} from 'class-validator';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  slug: string;

  @IsNotEmpty()
  @IsString()
  @Column()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Column()
  description: string;

  @Column({
    nullable: true,
    update: true,
  })
  imageUrl: string;

  @IsNotEmpty()
  @IsInt()
  @Column()
  price: number;

  @OneToMany(() => Product, product => product.category)
  products: Product[];
}
