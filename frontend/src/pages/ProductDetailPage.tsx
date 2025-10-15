import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Product } from "../types/Product";
import { useCart } from "../context/CartContext";

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
    <div>
      <h2>{product.title}</h2>
      {product.image_url && (
        // eslint-disable-next-line jsx-a11y/alt-text
        <img
          src={product.image_url}
          alt={product.title}
          style={{
            maxWidth: 480,
            width: "100%",
            height: "auto",
            marginBottom: 12,
          }}
        />
      )}
      <button onClick={() => addItem({ product_id: product.product_id })}>
        Add to Cart
      </button>
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

      {product.attributes && typeof product.attributes === "object" && (
        <section>
          <h3>Extra Info</h3>
          <pre>
            {Object.entries(product.attributes)
              .map(([key, value]) => `"${key}": "${value}"`)
              .join(",\n")}
          </pre>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;
