import {Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Category} from "../../categories/category/category.entity";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({
        nullable: true
    })
    imageUrl: string;

    @ManyToOne(() => Category, (category) => category.products)
    category: Category;
}