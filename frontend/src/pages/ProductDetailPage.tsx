import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Product } from "../types/Product";
import { useCart } from "../context/CartContext";
import { FaCartPlus } from "react-icons/fa";
import { useTelemetry } from "../hooks/useTelemetry";
import { getProductByIdApi } from "../api/catalogApi";
import { getRecommendationApi } from "../api/recommendationsApi";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addItem } = useCart();
  const { sendEvent } = useTelemetry();

  useEffect(() => {
    if (!id) return;

    const loadProductAndRecommendations = async () => {
      setLoading(true);
      setError(null);
      try {
        // 🧩 1. Fetch product details from backend
        const prod = await getProductByIdApi(id);
        setProduct(prod);

        // 🧩 2. Send telemetry event
        await sendEvent("product_viewed", { product_id: id });

        // 🧩 3. Fetch recommendations
        const rec = await getRecommendationApi(id);
        setRecommendations(rec.related_products || []);
      } catch (err: any) {
        console.error("Failed to load product details:", err);
        setError("Could not load product details");
      } finally {
        setLoading(false);
      }
    };

    loadProductAndRecommendations();
  }, [id]);

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Product not found.</p>;

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

          {product.tags && product.tags.length > 0 && (
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

      {/* 🧩 Recommendations Section */}
      <div className="product-recommendations">
        <h3>Frequently Bought Together</h3>
        {recommendations.length > 0 ? (
          <ul>
            {recommendations.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        ) : (
          <p>No related products found.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
