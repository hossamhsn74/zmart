import "reflect-metadata";
import { DataSource } from "typeorm";
import { Cart } from "../entities/Cart";
import { CartItem } from "../entities/CartItem";
import { Order } from "../entities/Order";
import dotenv from "dotenv";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "postgres",
  database: process.env.DB_NAME || "cart_order_db",
  entities: [Cart, CartItem, Order],
  synchronize: true, // disable in prod
  logging: false,
});
