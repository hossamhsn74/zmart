import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import CartItem from "../components/CartItem";

const CartPage = () => {
  const { items, fetchCart, checkout } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // ✅ Load cart on mount
  useEffect(() => {
    fetchCart();
  }, []);

  const total =
    items?.reduce((sum: number, i: any) => sum + i.subtotal, 0) || 0;

  // ✅ Checkout with login enforcement
  const handleCheckout = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await checkout();
      setMessage(`✅ ${res.message}. Total: $${res.total.toFixed(2)}`);
      await fetchCart(); // refresh cart

      // Wait a moment before redirect
      setTimeout(() => navigate("/products"), 3000);
    } catch (err: any) {
      setMessage(`❌ ${err.response?.data?.message || "Checkout failed"}`);
    } finally {
      setLoading(false);
    }
  };

  if (!items || items.length === 0) {
    return <p className="cart-empty">Your cart is empty.</p>;
  }

  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Cart</h2>

      <ul className="cart-list">
        {items.map((item: any) => (
          <CartItem key={item.id} {...item} />
        ))}
      </ul>

      <div className="cart-total">
        <span>Total:</span>
        <span>${total.toFixed(2)}</span>
      </div>

      {message && <p className="cart-message">{message}</p>}

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="cart-checkout-btn"
      >
        {loading ? "Processing..." : "Checkout"}
      </button>
    </div>
  );
};

export default CartPage;
