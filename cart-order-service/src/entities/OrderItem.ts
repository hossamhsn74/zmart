import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Order } from "./Order";

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn("uuid")
  id: string | undefined;

  @Column({ type: "varchar" })
  product_id: string | undefined;

  @Column("int")
  qty: number | undefined;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order | undefined;
}
