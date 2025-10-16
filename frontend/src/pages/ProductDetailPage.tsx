import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Product } from "../types/Product";
import { useCart } from "../context/CartContext";
import { FaCartPlus } from "react-icons/fa";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    if (!id) return;
    // Try to read products list from localStorage (saved by ProductsPage)
    try {
      const raw = localStorage.getItem("products_list");
      if (raw) {
        const products: Product[] = JSON.parse(raw);
        const p = products.find((x) => x.product_id === id);
        if (p) {
          setProduct(p);
          return;
        }
      }
    } catch (err) {
      // fallthrough to not found
      console.error("Error reading products from storage:", err);
    }

    setProduct(null);
  }, [id]);

  if (product === null) return <p>Loading / product not found...</p>;

  return (
    <div className="product-detail">
      <div className="product-detail-header">
        {product.image_url && (
          <img
            src={product.image_url}
            alt={product.title}
            className="product-detail-image"
          />
        )}
        <div className="product-detail-info">
          <h2 className="product-detail-title">{product.title}</h2>
          <p>
            <strong>Brand:</strong> {product.brand}
          </p>
          <p>
            <strong>Category:</strong> {product.category}
          </p>
          <p>
            <strong>Price:</strong> ${Number(product.price).toFixed(2)}
          </p>
          <p>
            <strong>Stock:</strong> {product.stock}
          </p>

          {product.tags && product.tags?.length > 0 && (
            <p>
              <strong>Tags:</strong> {product.tags.join(", ")}
            </p>
          )}

          <button
            className="add-to-cart-btn"
            onClick={() => addItem({ product_id: product.product_id })}
          >
            <FaCartPlus className="cart-icon" /> Add to Cart
          </button>
        </div>
      </div>

      {/* {product.attributes && (
                <section className="product-extra-section">
                    <h3>Extra Info</h3>
                    <ul>
                        {Object.entries(product.attributes).map(([key, value]) => (
                            <li key={key}>
                                <strong>{key}</strong>: {String(value)}
                            </li>
                        ))}
                    </ul>
                </section>
            )} */}
    </div>
  );
};

export default ProductDetailPage;
