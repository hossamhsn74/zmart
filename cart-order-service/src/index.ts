import { AppDataSource } from "./config/db";
import app from "./app";

const PORT = process.env.PORT || 8002;

AppDataSource.initialize()
  .then(() => {
    console.log("✅ Database connected");
    app.listen(PORT, () =>
      console.log(`🚀 Cart & Order service running on port ${PORT}`),
    );
  })
  .catch((err) => console.error("❌ DB connection error:", err));
