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

    @Column({ nullable: true })
    aparment: string;

    @Column()
    postalCode: number;

    @Column()
    state: string;

    @ManyToOne(() => User, (user) => user.addresses)
    user: User;
}