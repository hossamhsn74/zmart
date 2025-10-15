import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { CartItem } from "./CartItem";

@Entity()
export class Cart {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ nullable: true })
  user_id?: string;

  @Column({ nullable: true })
  session_id?: string;

  @OneToMany(() => CartItem, (item) => item.cart, { cascade: true })
  items!: CartItem[];
}
