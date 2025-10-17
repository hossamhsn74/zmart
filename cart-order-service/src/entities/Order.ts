import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { OrderItem } from "./OrderItem";

@Entity({ name: "orders" }) // ✅ avoid reserved word
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ nullable: true })
  user_id!: string;

  @Column({ nullable: true })
  session_id!: string;

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  total!: number;

  @Column({ default: "PENDING" })
  status!: string;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items!: OrderItem[];
}
