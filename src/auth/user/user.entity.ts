import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {IsEmail, IsNotEmpty, IsString} from "class-validator";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @IsString()
    @Column()
    name: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @Column({ unique: true })
    email: string;

    @IsNotEmpty()
    @IsString()
    @Column()
    password: string;

    @Column({default: 0})
    points: number;

    @Column({ unique: true, nullable: true })
    hashedRt: string;
}