import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "../../../shared/config/db.js";
import orderRoutes from "./routes/order.routes.js";

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());

app.use("/", orderRoutes);

app.get("/health", (req, res) => res.json({ status: "ok", service: "order-service" }));

await connectDB();

app.listen(PORT, () => console.log(`Order service running on port ${PORT}`));
