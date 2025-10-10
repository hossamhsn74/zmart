import express from "express";
import { addToCart, getCart, checkout } from "../controllers/cartController";

const router = express.Router();

router.post("/cart/items", addToCart);
router.get("/cart", getCart);
router.post("/checkout", checkout);

export default router;
