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
  host: process.env.DB_HOST || "postgresql",
  port: 5432,
  username: process.env.DB_USER || "user",
  password: process.env.DB_PASS || "password",
  database: process.env.DB_NAME || "cart_order_db",
  entities: [Cart, CartItem, Order, OrderItem],
  synchronize: true, // disable in prod
  logging: false,
});
