import api from "./axiosClient";

export const getCart = async (params: {
  user_id?: string;
  session_id?: string;
}) => {
  const { data } = await api.get("/cart", { params });
  return data;
};

export const addToCart = async (payload: any) => {
  const { data } = await api.post("/cart/items", payload);
  return data;
};

export const checkout = async (payload: any) => {
  const { data } = await api.post("/checkout", payload);
  return data;
};
