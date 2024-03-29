import { Review } from 'src/sells/entities/review/review.entity';
import {SubCategory} from 'src/subcategories/subcategory/subcategory.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {Category} from '../../categories/category/category.entity';
import {ProductImage} from '../image/image.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true, nullable: true})
  stripeId: string;

  @Column()
  name: string;

  @Column({nullable: true})
  price: number;

  @Column({nullable: true})
  slug: string;

  @Column()
  description: string;

  @ManyToOne(() => Category, category => category.products, {
    cascade: true,
  })
  category: Category;

  @OneToMany(() => ProductImage, image => image.product, {
    cascade: true,
  })
  images: ProductImage[];

  @ManyToMany(() => SubCategory, subCategory => subCategory.products, {
    cascade: true,
  })
  @JoinTable()
  subCategories: SubCategory[];

  @OneToMany(() => Review, (review) => review.product, {
    cascade: true
  })
  reviews: Review[]
}
