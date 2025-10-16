import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Cart } from "../entities/Cart";
import { CartItem } from "../entities/CartItem";
import { Product } from "../entities/Product";
import { Order } from "../entities/Order";

const cartRepo = AppDataSource.getRepository(Cart);
const cartItemRepo = AppDataSource.getRepository(CartItem);

export const getCart = async (req: Request, res: Response) => {
  try {
    const { user_id, session_id } = req.query;

    const userIdStr = typeof user_id === "string" ? user_id : undefined;
    const sessionIdStr =
      typeof session_id === "string" ? session_id : undefined;

    const where =
      userIdStr !== undefined
        ? { user_id: userIdStr }
        : sessionIdStr !== undefined
          ? { session_id: sessionIdStr }
          : undefined;

    if (!where) {
      return res
        .status(400)
        .json({ message: "user_id or session_id required" });
    }

    const cart = await cartRepo.findOne({
      where: where as any,
      relations: ["items"],
    });

    if (!cart || !cart.items.length) {
      return res.status(404).json({ message: "Cart is empty" });
    }

    // 🧾 Build response
    const items = cart.items.map((i) => ({
      id: i.id,
      title: i.title,
      price: Number(i.price),
      qty: i.qty,
      subtotal: Number(i.price) * i.qty,
    }));

    const total = items.reduce((sum, i) => sum + i.subtotal, 0);

    return res.status(200).json({
      cart_id: cart.id,
      items,
      total,
    });
  } catch (error: any) {
    console.error("Error getting cart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const productRepo = AppDataSource.getRepository(Product);

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { user_id, session_id, product_id, qty } = req.body;

    // 🧱 1. Validate input
    if (!product_id)
      return res.status(400).json({ message: "Product ID is required." });
    if (!qty || qty <= 0)
      return res
        .status(400)
        .json({ message: "Quantity must be greater than 0." });
    if (!user_id && !session_id)
      return res
        .status(400)
        .json({ message: "Either user_id or session_id is required." });

    // 🧩 2. Fetch product info from DB (shared catalog table)
    const product = await productRepo.findOne({
      where: { product_id: product_id },
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // 🧩 3. Find or create cart
    const where = user_id ? { user_id } : { session_id };
    let cart = await cartRepo.findOne({ where, relations: ["items"] });
    if (!cart) {
      cart = cartRepo.create(where);
      await cartRepo.save(cart);
      cart.items = [];
    }

    // 🧠 4. Check if product already in cart
    let existingItem = cart.items.find((i) => i.product_id === product_id);

    if (existingItem) {
      existingItem.qty += qty;
      await cartItemRepo.save(existingItem);
    } else {
      // 🧾 Store snapshot of product title & price
      const newItem = cartItemRepo.create({
        product_id,
        title: product.title,
        price: product.price,
        qty,
        cart,
      });
      await cartItemRepo.save(newItem);
      cart.items.push(newItem);
    }

    // 🧮 5. Prepare clean response
    const items = cart.items.map((i) => ({
      id: i.id,
      title: i.title,
      price: Number(i.price),
      qty: i.qty,
      subtotal: Number(i.price) * i.qty,
    }));

    const total = items.reduce((sum, i) => sum + i.subtotal, 0);

    return res.status(200).json({
      message: "Item added to cart successfully",
      items,
      total,
    });
  } catch (error: any) {
    console.error("Error adding to cart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const orderRepo = AppDataSource.getRepository(Order);

export const checkout = async (req: Request, res: Response) => {
  try {
    const { user_id, session_id } = req.body;

    const where: any = user_id ? { user_id } : { session_id };
    const cart = await cartRepo.findOne({
      where,
      relations: ["items"],
    });

    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Cart is empty." });

    // ✅ Check stock
    for (const item of cart.items) {
      const product = await productRepo.findOneBy({ id: item.product_id });
      if (!product) {
        return res
          .status(400)
          .json({ message: `Product ${item.product_id} not found.` });
      }
      if (product.stock < item.qty) {
        return res
          .status(400)
          .json({ message: `Insufficient stock for ${product.title}` });
      }
    }

    // ✅ Deduct stock and create order
    const order = orderRepo.create({
      user_id: user_id || null,
      session_id: session_id || null,
      total: 0,
      status: "PAID",
    });
    await orderRepo.save(order);

    let total = 0;
    for (const item of cart.items) {
      const product = await productRepo.findOneBy({ id: item.product_id });
      if (product) {
        product.stock -= item.qty;
        await productRepo.save(product);

        const orderItem = new OrderItem();
        orderItem.order = order;
        orderItem.product_id = item.product_id;
        orderItem.qty = item.qty;
        orderItem.price = item.price;
        total += item.price * item.qty;

        await AppDataSource.getRepository(OrderItem).save(orderItem);
      }
    }

    order.total = total;
    await orderRepo.save(order);

    // ✅ Remove cart
    await cartRepo.remove(cart);

    return res.json({
      message: "Checkout complete",
      total,
      order_id: order.id,
    });
  } catch (err) {
    console.error("Checkout error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
