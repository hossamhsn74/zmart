import "reflect-metadata";
import { DataSource } from "typeorm";
import { Cart } from "../models/Cart";
import { CartItem } from "../models/CartItem";
import { Order } from "../models/Order";
import { OrderItem } from "../models/OrderItem";
import dotenv from "dotenv";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "postgres",
  database: process.env.DB_NAME || "cart_order_db",
  synchronize: true, // for dev only
  logging: false,
  entities: [Cart, CartItem, Order, OrderItem],
});
