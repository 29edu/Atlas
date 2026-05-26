import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../../../.env") });
import express from "express";
import cors from "cors";
import connectDB from "../../../shared/config/db.js";
import paymentRoutes from "./routes/payment.routes.js";
import mongoose from "mongoose";

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());

app.use("/payment", paymentRoutes);

app.get("/health", (req, res) => res.json({ status: "ok", service: "payment-service" }));

await connectDB(mongoose);

app.listen(PORT, () => console.log(`Payment service running on port ${PORT}`));
