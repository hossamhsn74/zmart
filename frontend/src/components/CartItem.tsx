import React from "react";

interface CartItemProps {
  id: string;
  title: string;
  price: number;
  qty: number;
  subtotal: number;
}

const CartItem: React.FC<CartItemProps> = ({ title, price, qty, subtotal }) => {
  return (
    <li className="cart-item">
      <div className="cart-item-left">
        <div className="cart-item-info">
          <p className="cart-item-title">{title}</p>
          <p className="cart-item-price">
            ${price.toFixed(2)} x {qty}{" "}
          </p>
        </div>
      </div>

      <div className="cart-item-right">
        <p className="cart-item-subtotal">${subtotal.toFixed(2)}</p>
      </div>
    </li>
  );
};

export default CartItem;
