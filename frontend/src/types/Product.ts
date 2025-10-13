export interface Product {
  product_id: string; // backend uses product_id as primary key
  title: string;
  brand: string;
  category: string;
  price: number | string; // backend may return decimal as number or string
  image_url?: string;
  stock?: number;
  tags?: string[];
  attributes?: Record<string, any> | null;
}
