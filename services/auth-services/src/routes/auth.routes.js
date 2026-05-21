import express from "express";
const router = express.Router();
import { login, signUp } from "../controllers/auth.controller.js";

const timeLog = (req, res, next) => {
  console.log("Time: ", new Date().toLocaleString());
  next();
};

router.use(timeLog);

router.post("/login", login);
router.post("/signup", signUp);

export default router;
