import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import {
  FaShoppingCart,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaBox,
} from "react-icons/fa";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const { cartCount } = useCart();
  const [bump, setBump] = useState(false);

  useEffect(() => {
    if (cartCount === 0) return;
    setBump(true);
    const timer = setTimeout(() => setBump(false), 300);
    return () => clearTimeout(timer);
  }, [cartCount]);

  return (
    <header className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-link">
          <FaBox className="nav-icon" /> Products
        </Link>
      </div>

      <div className="nav-right">
        <Link to="/cart" className="cart-link">
          <div
            className="cart-icon-wrapper"
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FaShoppingCart
              className="cart-icon"
              style={{
                fontSize: "1.6rem", // 🔹 slightly larger icon
                transition: "transform 0.2s ease",
              }}
            />

            {cartCount > 0 && (
              <span
                className={`cart-count-badge ${bump ? "bump" : ""}`}
                style={{
                  position: "absolute",
                  top: "-0.4rem",
                  right: "-0.5rem",
                }}
              >
                {cartCount}
              </span>
            )}
          </div>
        </Link>

        {user ? (
          <>
            <span className="welcome-text">Welcome, {user.name}</span>
            <button className="logout-btn" onClick={logoutUser}>
              <FaSignOutAlt /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              <FaSignInAlt /> Login
            </Link>
            <Link to="/register" className="nav-link">
              <FaUserPlus /> Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
