import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { setupProxies } from "./utils/proxy";

dotenv.config();

const app = express();

// --- Global Middlewares ---
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

// --- Register Service Proxies ---
setupProxies(app);

// Healthcheck endpoint
app.get("/", (_, res) => {
  res.json({ message: "🧭 API Gateway running successfully" });
});

export default app;
