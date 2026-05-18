import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "../../../shared/config/db.js";
import paymentRoutes from "./routes/payment.routes.js";

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());

app.use("/payment", paymentRoutes);

app.get("/health", (req, res) => res.json({ status: "ok", service: "payment-service" }));

await connectDB();

app.listen(PORT, () => console.log(`Payment service running on port ${PORT}`));
