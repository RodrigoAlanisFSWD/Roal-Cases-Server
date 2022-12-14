import { Product } from "src/products/product/product.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

enum DiscountType {
    FOR_FINAL_PRICE = "FOR_FINAL_PRICE",
    FOR_PRODUCTS = 'FOR_PRODUCTS'
}

@Entity()
export class Discount {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    code: string;

    @Column()
    type: DiscountType;

    @Column()
    expirationDate: Date;

    @ManyToMany(() => Product, {
        cascade: true
    })
    @JoinTable()
    products: Product[]
}