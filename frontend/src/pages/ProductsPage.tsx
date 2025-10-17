import { useEffect, useState } from "react";
import { getProducts } from "../api/catalogApi";
import type { Product } from "../types/Product";
import ProductCard from "../components/ProductCard";
import "../App.css";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10; // ✅ Show 2 items per page

  // Fetch products from API with pagination params
  const fetchProducts = async (page: number) => {
    setLoading(true);
    try {
      const data = await getProducts(page, itemsPerPage);
      // Expect response like { total, page, limit, results }
      setProducts(data.results);
      setTotalPages(Math.ceil(data.total / data.limit));
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) return <p className="loading-text">Loading products...</p>;
  if (!products.length) return <p className="empty-text">No products found.</p>;

  return (
    <div className="products-page">
      <h2 className="page-title">Products</h2>

      <div className="products-grid">
        {products.map((p) => (
          <ProductCard key={p.product_id} product={p} />
        ))}
      </div>

      {/* ✅ Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ‹ Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`pagination-btn ${currentPage === i + 1 ? "active" : ""}`}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next ›
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
