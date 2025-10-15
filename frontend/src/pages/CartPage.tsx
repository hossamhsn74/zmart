import { useEffect } from "react";
import { useCart } from "../context/CartContext";

const CartPage = () => {
  const { items, fetchCart, checkout } = useCart();

  useEffect(() => {
    fetchCart();
  }, []);

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div>
      <h2>Your Cart</h2>
      {items.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <>
          <ul>
            {items.map((i) => (
              <li key={i.product_id}>
                {i.title} — ${i.price} × {i.qty}
              </li>
            ))}
          </ul>
          <p>
            <strong>Total: ${total.toFixed(2)}</strong>
          </p>
          <button onClick={checkout}>Checkout</button>
        </>
      )}
    </div>
  );
};

export default CartPage;
