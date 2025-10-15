import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Cart } from "./Cart";

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn("uuid")
  id: string | undefined;

  @Column()
  product_id!: string;

  @Column("varchar", { nullable: true })
  title?: string | undefined;

  @Column("decimal", { precision: 10, scale: 2 })
  price!: number;

  @Column("int")
  qty!: number;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: "CASCADE" })
  cart!: Cart;
}
