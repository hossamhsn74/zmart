import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { CartItem } from "./CartItem";

@Entity()
export class Cart {
  @PrimaryGeneratedColumn("uuid")
  id: string | undefined;

  @Column({ type: "varchar", nullable: true })
  user_id: string | undefined;

  @Column({ type: "varchar", nullable: true })
  session_id: string | undefined;

  @OneToMany(() => CartItem, (item) => item.cart, { cascade: true })
  items: CartItem[] | undefined;
}
