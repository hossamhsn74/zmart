import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entity/Product";
import { ILike } from "typeorm";
import { validate as isUuid } from "uuid";

const productRepo = AppDataSource.getRepository(Product);

// GET /products?search=&page=
export const getProducts = async (req: Request, res: Response) => {
  const { search = "", page = 1, limit = 10 } = req.query as any;
  const skip = (page - 1) * limit;

  const [products, count] = await productRepo.findAndCount({
    where: search
      ? [
          { title: ILike(`%${search}%`) },
          { brand: ILike(`%${search}%`) },
          { category: ILike(`%${search}%`) },
        ]
      : {},
    skip,
    take: limit,
  });

  res.json({
    total: count,
    page: Number(page),
    limit: Number(limit),
    results: products,
  });
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ message: "Invalid product ID format" });
  }

  const product = await productRepo.findOneBy({ product_id: id });
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
};
