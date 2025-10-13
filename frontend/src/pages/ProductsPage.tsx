import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api/catalogApi";
import type { Product } from "../types/Product";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getProducts();
        setProducts(data);
        try {
          localStorage.setItem("products_list", JSON.stringify(data));
        } catch (err) {
          console.warn("Could not save products to localStorage:", err);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Products</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 16,
        }}
      >
        {products.map((p) => (
          <article
            key={p.product_id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              overflow: "hidden",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            }}
          >
            <Link
              to={`/products/${p.product_id}`}
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <div
                style={{
                  height: 160,
                  background: "#f6f6f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {p.image_url ? (
                  // Image covers the area
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.image_url}
                    alt={p.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div style={{ padding: 16 }}>{p.title}</div>
                )}
              </div>
              <div style={{ padding: 12 }}>
                <h3 style={{ margin: "0 0 8px" }}>{p.title}</h3>
                <p style={{ margin: "0 0 8px", color: "#555" }}>
                  {p.brand} • {p.category}
                </p>
                <p style={{ margin: 0, fontWeight: 600 }}>
                  ${Number(p.price).toFixed(2)}
                </p>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
