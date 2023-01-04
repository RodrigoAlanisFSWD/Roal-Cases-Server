import {IsNotEmpty, IsString} from 'class-validator';
import {Product} from 'src/products/product/product.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {Group} from '../../groups/group/group.entity';

@Entity()
export class SubCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @IsString()
  @Column()
  name: string;

  @ManyToOne(() => Group, group => group.subCategories)
  group: Group;

  @ManyToMany(() => Product, product => product.subCategories)
  products: Product[];
}
