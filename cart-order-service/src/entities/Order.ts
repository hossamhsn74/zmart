import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { OrderItem } from "./OrderItem";

@Entity()
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string | undefined;

  @Column("varchar")
  user_id: string | undefined;

  @Column("varchar")
  status: string | undefined; // e.g. 'PAID', 'PENDING'

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[] | undefined;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date | undefined;
}
