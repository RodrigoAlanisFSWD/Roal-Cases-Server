import { IsNotEmpty, IsString } from "class-validator";
import { Column, Entity, IsNull, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SubCategory } from "../../subcategories/subcategory/subcategory.entity";

@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @IsString()
    @Column()
    name: string;

    @OneToMany(() => SubCategory, (subCategory: SubCategory) => subCategory.group)
    subCategories: SubCategory[];
}