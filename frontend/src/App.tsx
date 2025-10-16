// src/App.tsx
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useCart } from "./context/CartContext";
import { useAuth } from "./context/AuthContext";

import ProductsPage from "./pages/ProductsPage";
// import CategoriesPage from "./pages/CategoriesPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  const { cartCount, fetchCart } = useCart();
  const { user, logoutUser } = useAuth();

  // ✅ Make sure a session_id exists for guest users
  useEffect(() => {
    let sid = localStorage.getItem("session_id");
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem("session_id", sid);
      console.log("Generated new session_id:", sid);
    }
  }, []);

  // ✅ Fetch cart on load (for both logged-in and guest)
  useEffect(() => {
    fetchCart();
  }, [user]); // re-fetch when user logs in/out

  return (
    <Router>
      <nav style={{ marginBottom: 20 }}>
        <Link to="/">Products</Link> | <Link to="/categories">Categories</Link>{" "}
        | <Link to="/cart">Cart ({cartCount})</Link> |{" "}
        {user ? (
          <>
            <span>Welcome, {user.name}</span>{" "}
            <button onClick={logoutUser}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link> |{" "}
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<ProductsPage />} />
        {/* <Route path="/categories" element={<CategoriesPage />} /> */}
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
