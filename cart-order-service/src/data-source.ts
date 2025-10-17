import "reflect-metadata";
import { DataSource } from "typeorm";
import { Cart } from "./entities/Cart";
import { CartItem } from "./entities/CartItem";
import dotenv from "dotenv";
import { Product } from "./entities/Product";
import { Order } from "./entities/Order";
import { OrderItem } from "./entities/OrderItem";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "postgres",
  database: process.env.DB_NAME || "zmart_cart",
  synchronize: true, // ❗ set false in prod; true only in dev
  logging: true,
  entities: [Product, Cart, CartItem, Order, OrderItem],
  migrations: ["dist/migrations/*.js"],
});
