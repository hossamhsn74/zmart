import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Cart } from "./Cart";

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn("uuid")
  id: string | undefined;

  @Column("varchar")
  product_id: string | undefined;

  @Column("int")
  qty: number | undefined;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: "CASCADE" })
  cart: Cart | undefined;
}
