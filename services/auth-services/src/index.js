import "dotenv/config";
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

app.get("/version", (req, res) =>
  res.json({
    version: "1.0.0",
    message: "Atlas Auth Service - Version 1",
  }),
);

app.get("/version2", (req, res) =>
  res.json({
    version: "2.0.0",
    message: "Atlas Auth Service - Version 1",
  }),
);

await connectDB();

app.listen(PORT, () => console.log(`Auth service running on port ${PORT}`));
