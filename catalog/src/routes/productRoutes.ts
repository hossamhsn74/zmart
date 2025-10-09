import express from "express";
import {
  getProducts,
  getProductById,
  getCategories,
} from "../controllers/productController";

const router = express.Router();

router.get("/products", getProducts);
router.get("/products/:id", getProductById);
router.get("/categories", getCategories);

export default router;
