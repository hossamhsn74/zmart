import { createProxyMiddleware } from "http-proxy-middleware";
import { Express } from "express";
import dotenv from "dotenv";
dotenv.config();

/**
 * Registers proxy routes for all downstream services.
 */
export function setupProxies(app: Express) {
  const services = [
    { route: "/auth", target: process.env.AUTH_SERVICE_URL },
    { route: "/products", target: process.env.CATALOG_SERVICE_URL },
    { route: "/cart", target: process.env.CART_SERVICE_URL },
    { route: "/checkout", target: process.env.CART_SERVICE_URL },
    { route: "/recommendations", target: process.env.RECOMMEND_SERVICE_URL },
  ];

  services.forEach(({ route, target }) => {
    if (!target) {
      console.warn(`⚠️ Missing target for route ${route}`);
      return;
    }

    app.use(
      route,
      createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite: (path) => path.replace(route, ""),
      }),
    );
    console.log(`✅ Proxy registered: ${route} → ${target}`);
  });
}
