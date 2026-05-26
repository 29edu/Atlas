import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../../../.env") });
import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import rateLimit from "../../../shared/middlewares/rateLimit.middleware.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(rateLimit(100, 60_000));

const services = {
    "/auth":    process.env.AUTH_SERVICE_URL    || "http://localhost:3001",
    "/products":process.env.PRODUCT_SERVICE_URL || "http://localhost:3002",
    "/cart":    process.env.CART_SERVICE_URL     || "http://localhost:3003",
    "/orders":  process.env.ORDER_SERVICE_URL    || "http://localhost:3004",
    "/payment": process.env.PAYMENT_SERVICE_URL  || "http://localhost:3005",
};

for (const [path, target] of Object.entries(services)) {
    app.use(path, createProxyMiddleware({ target, changeOrigin: true }));
}

app.get("/health", (req, res) => res.json({ status: "ok", service: "api-gateway" }));

app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
