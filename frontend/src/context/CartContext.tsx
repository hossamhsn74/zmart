/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { addToCart, checkoutApi, getCart } from "../api/cartApi";
import { useAuth } from "./AuthContext";

export const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [items, setItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // In CartContext.tsx
  useEffect(() => {
    let sid = localStorage.getItem("session_id");
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem("session_id", sid);
    }
    setSessionId(sid);
  }, []);

  useEffect(() => {
    if (user || sessionId) fetchCart();
  }, [user, sessionId]);

  const fetchCart = async () => {
    try {
      const params: any = user
        ? { user_id: user.id }
        : { session_id: sessionId };
      const data = await getCart(params);
      setItems(data.items || []);
    } catch (err) {
      console.warn("Cart fetch failed:", err);
      setItems([]);
    }
  };

  const addItem = async (item: {
    product_id: string;
    title: string;
    price: number;
    qty?: number;
  }) => {
    const payload: any = { ...item, qty: item.qty || 1 };
    if (user) payload.user_id = user.id;
    else payload.session_id = sessionId;

    await addToCart(payload);
    await fetchCart();
  };

  const checkout = async () => {
    try {
      const payload = user ? { user_id: user.id } : { session_id: sessionId };
      const res = await checkoutApi(payload);
      return res;
      await fetchCart(); // refresh empty cart
    } catch (err: any) {
      return err.response?.data?.message || "Checkout failed";
    }
  };

  useEffect(() => {
    const count = items.reduce((sum, i: any) => sum + i.qty, 0);
    setCartCount(count);
  }, [items]);

  return (
    <CartContext.Provider
      value={{ items, cartCount, fetchCart, addItem, checkout }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
