import express from "express";
import {
  generateInterviewQuestions,
  generateConceptExplanation,
} from "../controller/ai-controller.js";
import { protect } from "../middlewares/auth-middleware.js";

const router = express.Router();

// ✅ FIXED ROUTES
router.post("/generate", protect, generateInterviewQuestions);
router.post("/explain", protect, generateConceptExplanation);

export default router;
