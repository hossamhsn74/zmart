import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProductDetailPage from "./pages/ProductDetailPage";
import CategoriesPage from "./pages/CategoriesPage";
import ProductsPage from "./pages/ProductsPage";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Products</Link> | <Link to="/categories">Categories</Link>
      </nav>

      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
