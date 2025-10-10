import express from "express";
import cors from "cors";
import cartRoutes from "./routes/cartRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", cartRoutes);

app.get("/", (req, res) => {
  res.send("Cart and Order Service is running");
});

export default app;
