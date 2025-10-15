import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  product_id!: string;

  @Column()
  title!: string;

  @Column()
  brand!: string;

  @Column()
  category!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price!: number;

  @Column("text", { array: true, default: [] })
  tags!: string[];

  @Column()
  image_url!: string;

  @Column("int")
  stock!: number;

  @Column("jsonb", { nullable: true })
  attributes!: Record<string, any>;
}
