import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Shipment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  estimated: string;
}
