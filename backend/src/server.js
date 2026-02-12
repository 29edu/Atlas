import express from "express";
import cors from "cors";
import connectDB from "./shared/config/db.js";
import authRoutes from "./modules/auth/auth.routes.js";

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 5082;

// Connect to Mongodb
await connectDB();

// Routes
app.use("/", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
