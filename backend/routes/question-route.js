import express from "express";
import { protect } from "../middlewares/auth-middleware.js";
import { togglePin } from "../controller/session-controller.js";

const router = express.Router();

// ================= PIN / UNPIN =================
router.patch("/pin/:id", protect, togglePin);

// ================= TEST ROUTE =================
router.get("/", (req, res) => {
  res.send("Question route working ✅");
});

export default router;
