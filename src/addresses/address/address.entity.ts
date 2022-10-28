import { User } from "src/auth/user/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Address {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    street: string;

    @Column()
    number: number;

    @Column()
    aparment: string;

    @Column()
    postalCode: number;

    @Column()
    state: string;

    @Column()
    location: string;

    @ManyToOne(() => User, (user) => user.cart)
    user: User;
}