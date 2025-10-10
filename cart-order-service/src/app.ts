import express from "express";
import cors from "cors";
import cartRoutes from "./routes/cartRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", cartRoutes);

export default app;
