import { Router } from "express";
import { getCart, addToCart, checkout } from "../controllers/cartController";

const router = Router();

router.get("/get", getCart);
router.post("/items", addToCart);
router.post("/checkout", checkout);

export default router;
