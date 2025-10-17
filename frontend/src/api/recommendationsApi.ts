import api from "./axiosClient";

export interface RecommendationResponse {
  product_id: string;
  related_products: string[];
}

export const sendEventApi = async (event: Record<string, any>) => {
  const { data } = await api.post("/recommendations/events/", event);
  return data;
};

export const getRecommendationApi = async (
  id: string,
): Promise<RecommendationResponse> => {
  const { data } = await api.get(`/recommendations/recommendations/${id}`);
  return data;
};

export async function getFBT(
  productId: string,
  opts?: { limit?: number; preferMargin?: boolean },
) {
  const params = new URLSearchParams({
    product_id: productId,
    limit: String(opts?.limit ?? 5),
    prefer_margin: String(!!opts?.preferMargin),
  });
  const res = await fetch(
    `/recommendations/recommendations/fbt?${params.toString()}`,
  );
  return res.json(); // { items: [...] }
}
