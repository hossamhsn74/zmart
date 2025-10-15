import { AppDataSource } from "./data-source";

AppDataSource.initialize()
  .then(async () => {
    console.log("📦 Running migrations...");
    await AppDataSource.runMigrations();
    console.log("✅ Migrations completed");
    await AppDataSource.destroy();
  })
  .catch((err) => {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  });
