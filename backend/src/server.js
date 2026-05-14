import express from "express";
import cors from "cors";
import connectDB from "./shared/config/db.js";
import authRoutes from "./modules/auth/auth.routes.js";
import productRoutes from "./modules/products/product.routes.js";
import rateLimit from "./shared/middlewares/rateLimit.middleware.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(rateLimit(100, 60_000)); // 100 requests per minute
const PORT = 5082;

// Connect to Mongodb
await connectDB();

// Routes
app.use("/", authRoutes);
app.use("/", productRoutes); 

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
