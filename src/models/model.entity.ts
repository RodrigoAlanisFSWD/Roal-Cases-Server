import { Category } from "src/categories/category/category.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Brand {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(() => Category)
    @JoinTable()
    categories: Category;

    @OneToMany(() => Model, (model) => model.brand)
    models: Model[];
}

@Entity()
export class Model {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Brand, (brand) => brand.models)
    brand: Brand;

    @Column()
    name: string;

    @ManyToMany(() => Category)
    @JoinTable()
    categories: Category;
}