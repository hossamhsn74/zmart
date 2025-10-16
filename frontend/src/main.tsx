import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; // global styles (reset, variables, base)
import "./App.css"; // app components (navbar, cart, auth)
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { CartProvider } from "./context/CartContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
);
