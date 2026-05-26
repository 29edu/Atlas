import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../../../.env") });
import express from "express";
import cors from "cors";
import connectDB from "../../../shared/config/db.js";
import productRoutes from "./routes/product.routes.js";

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.use("/", productRoutes);

app.get("/health", (req, res) => res.json({ status: "ok", service: "product-service" }));

await connectDB();

app.listen(PORT, () => console.log(`Product service running on port ${PORT}`));
