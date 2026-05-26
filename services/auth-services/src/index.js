import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../../../.env") });

import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import connectDB from "../../../shared/config/db.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

app.get("/health", (req, res) =>
  res.json({ status: "ok", service: "auth-service" }),
);

await connectDB(mongoose);

app.listen(PORT, () => console.log(`Auth service running on port ${PORT}`));
