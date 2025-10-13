import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage";
import CategoriesPage from "./pages/CategoriesPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { useAuth } from "./context/AuthContext";
import { PrivateRoute } from "./components/PrivateRoute";
import { CheckoutPage } from "./pages/CheckoutPage";

function App() {
  const { user, logoutUser } = useAuth();

  return (
    <Router>
      <nav>
        <Link to="/">Products</Link> | <Link to="/categories">Categories</Link>{" "}
        |{" "}
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
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <CheckoutPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
