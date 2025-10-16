import api from "./axiosClient";
import type { Product } from "../types/Product";
// import type { Category } from "../types/Category";

export const getProducts = async (): Promise<Product[]> => {
  const { data } = await api.get("/products/list/");
  console.log("Fetched products:", data);
  // Backend returns a paginated shape: { total, page, limit, results }
  if (data && typeof data === "object" && Array.isArray(data.results)) {
    return data.results as Product[];
  }

  // Fallback: assume the API returned an array of products directly
  return data as Product[];
};

export const getProductById = async (id: string): Promise<Product> => {
  const { data } = await api.get(`/products/${id}`);
  console.log(`Fetched product with id ${id}:`, data);

  return data;
};

// export const getCategories = async (): Promise<Category[]> => {
//     const { data } = await api.get("/products/categories/list");
//     console.log("Fetched categories:", data);
//     return data;
// };
