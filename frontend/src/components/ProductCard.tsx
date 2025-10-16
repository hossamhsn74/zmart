import { Link } from "react-router-dom";
import { FaCartPlus } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import type { Product } from "../types/Product";
import "../App.css";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const [animate, setAnimate] = useState(false);

  const handleAddToCart = () => {
    addItem({
      product_id: product.product_id,
      title: product.title,
      price: Number(product.price),
      qty: 1,
    });
  };

  return (
    <article className="product-card">
      <Link to={`/products/${product.product_id}`} className="product-link">
        <div className="product-image-container">
          {product.image_url ? (
            <img
              src={product.image_url || ""}
              alt={product.title}
              className="product-image"
            />
          ) : (
            <div className="product-placeholder">{product.title}</div>
          )}
        </div>

        <div className="product-details">
          <h3 className="product-title">{product.title}</h3>
          <p className="product-meta">
            {product.brand} • {product.category}
          </p>
          <p className="product-price">${Number(product.price).toFixed(2)}</p>
        </div>
      </Link>

      <button
        className={`add-cart-btn ${animate ? "bump" : ""}`}
        onClick={() => {
          handleAddToCart();
          setAnimate(true);
          setTimeout(() => setAnimate(false), 400); // reset bump animation
        }}
      >
        <FaCartPlus className="cart-icon" />
      </button>
    </article>
  );
};

export default ProductCard;
