import { Router } from "express";
import { getCart, addToCart, checkout } from "../controllers/cartController";

const router = Router();

router.get("/cart", getCart);
router.post("/cart/items", addToCart);
router.post("/checkout", checkout);

export default router;
