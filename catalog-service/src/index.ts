import { AppDataSource } from "./data-source";
import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", productRoutes);

const PORT = process.env.PORT || 8000;

AppDataSource.initialize()
  .then(() => {
    console.log("✅ Database connected");
    app.listen(PORT, () =>
      console.log(`🚀 Catalog service running on port ${PORT}`),
    );
  })
  .catch((err) => console.error("❌ DB connection error:", err));
