import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { Cart } from "../models/Cart";
import { CartItem } from "../models/CartItem";
import { Order } from "../models/Order";
import { OrderItem } from "../models/OrderItem";

const cartRepo = AppDataSource.getRepository(Cart);
const cartItemRepo = AppDataSource.getRepository(CartItem);
const orderRepo = AppDataSource.getRepository(Order);
const orderItemRepo = AppDataSource.getRepository(OrderItem);

// POST /cart/items
export const addToCart = async (req: Request, res: Response) => {
  const { user_id, session_id, product_id, qty } = req.body;

  if (!product_id || !qty)
    return res.status(400).json({ message: "Missing product_id or qty" });

  let cart = await cartRepo.findOne({
    where: [{ user_id }, { session_id }],
    relations: ["items"],
  });

  if (!cart) {
    cart = cartRepo.create({ user_id, session_id, items: [] });
  }

  const existingItem = cart.items?.find((i) => i.product_id === product_id);
  if (existingItem) {
    existingItem.qty += qty;
  } else {
    const newItem = cartItemRepo.create({ product_id, qty });
    if (!cart.items) {
      cart.items = [];
    }
    cart.items.push(newItem);
  }

  await cartRepo.save(cart);
  return res.json(cart);
};

// GET /cart
export const getCart = async (req: Request, res: Response) => {
  const { user_id, session_id } = req.query;

  const userIdStr = typeof user_id === "string" ? user_id : undefined;
  const sessionIdStr = typeof session_id === "string" ? session_id : undefined;

  const cart = await cartRepo.findOne({
    where: [
      ...(userIdStr ? [{ user_id: userIdStr }] : []),
      ...(sessionIdStr ? [{ session_id: sessionIdStr }] : []),
    ],
    relations: ["items"],
  });

  if (!cart) return res.status(404).json({ message: "Cart not found" });
  return res.json(cart);
};

// POST /checkout
export const checkout = async (req: Request, res: Response) => {
  const { user_id, session_id } = req.body;

  const cart = await cartRepo.findOne({
    where: [{ user_id }, { session_id }],
    relations: ["items"],
  });

  if (!cart || (cart.items ?? []).length === 0)
    return res.status(400).json({ message: "Cart is empty" });

  // mock stock validation
  for (const item of cart.items ?? []) {
    if ((item.qty ?? 0) > 10)
      return res
        .status(400)
        .json({ message: `Not enough stock for product ${item.product_id}` });
  }

  const order = orderRepo.create({
    user_id: user_id || "guest",
    status: "PAID",
    items: (cart.items ?? []).map((i) =>
      orderItemRepo.create({ product_id: i.product_id, qty: i.qty }),
    ),
  });

  await orderRepo.save(order);
  await cartRepo.remove(cart);

  return res.json({ message: "Checkout successful", order });
};
