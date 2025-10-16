import api from "./axiosClient";
import type { Product } from "../types/Product";

export const getProducts = async (
  page: number = 1,
  limit: number = 2,
): Promise<{
  total: number;
  page: number;
  limit: number;
  results: Product[];
}> => {
  const { data } = await api.get(`/products/list/?page=${page}&limit=${limit}`);

  console.log(`Fetched products page ${page}:`, data);

  // ✅ Validate backend response structure
  if (
    data &&
    typeof data === "object" &&
    Array.isArray(data.results) &&
    typeof data.total === "number"
  ) {
    return data;
  }

  // ⚙️ Fallback: wrap a raw array response
  return {
    total: Array.isArray(data) ? data.length : 0,
    page,
    limit,
    results: Array.isArray(data) ? data : [],
  };
};

export const getProductById = async (id: string): Promise<Product> => {
  const { data } = await api.get(`/products/${id}`);
  console.log(`Fetched product with id ${id}:`, data);

  return data;
};
