import { AppDataSource } from "./data-source";
import app from "./app";
import "reflect-metadata";

AppDataSource.initialize()
  .then(() => {
    console.log("✅ Database connected");
    app.listen(8003, () =>
      console.log("🚀 Cart-Order Service running on port 8003"),
    );
  })
  .catch((err) => console.error("❌ DB connection error:", err));
