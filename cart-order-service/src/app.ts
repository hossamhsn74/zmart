import express from "express";
import cors from "cors";
import cartRoutes from "./routes/cartRoutes";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", cartRoutes);

app.get("/health", (req, res) => {
  res.send("Cart service is running");
});
export default app;
