import api from "./axiosClient";
import type { LoginData, RegisterData } from "../types/Auth";

export const login = async (payload: LoginData) => {
  const { data } = await api.post("/auth/login", payload);
  return data;
};

export const register = async (payload: RegisterData) => {
  const { data } = await api.post("/auth/signup", payload);
  return data;
};
