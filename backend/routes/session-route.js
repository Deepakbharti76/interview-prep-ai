import express from "express";
import { protect } from "../middlewares/auth-middleware.js";
import {
  createSession,
  getMySessions,
  getSessionById,
  deleteSession,
  togglePin,
} from "../controller/session-controller.js";

const router = express.Router();

router.post("/create", protect, createSession);
router.get("/my-sessions", protect, getMySessions);
router.get("/:id", protect, getSessionById);
router.delete("/:id", protect, deleteSession);
router.patch("/question/pin/:id", protect, togglePin);

export default router;
