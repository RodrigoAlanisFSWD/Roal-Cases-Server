import { IsNotEmpty, IsString } from "class-validator";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Group } from "../group/group.entity";

@Entity()
export class SubCategory {
    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @IsString()
    @Column()
    name: string;

    @ManyToOne(() => Group, (group) => group.subCategories)
    group: Group;
}