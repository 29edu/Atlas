import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "../../../shared/config/db.js";
import cartRoutes from "./routes/cart.routes.js";

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

app.use("/", cartRoutes);

app.get("/health", (req, res) => res.json({ status: "ok", service: "cart-service" }));

await connectDB();

app.listen(PORT, () => console.log(`Cart service running on port ${PORT}`));
