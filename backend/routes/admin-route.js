import express from "express";
import { protect } from "../middlewares/auth-middleware.js";
import { isAdmin } from "../middlewares/admin-middleware.js";
import {
  getDashboardStats,
  getAllUsers,
  getUserDetails,
  deleteUser,
  toggleBlockUser,
  promoteUser,
  getAllSessions,
  getSessionDetails,
  deleteSessionAdmin,
  getAnalytics,
} from "../controller/admin-controller.js";

const router = express.Router();

// 🔒 Every route below requires a valid JWT AND role === "admin"
router.use(protect, isAdmin);

// ================= DASHBOARD =================
router.get("/dashboard", getDashboardStats);

// ================= USERS =================
router.get("/users", getAllUsers);
router.get("/users/:id", getUserDetails);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/block", toggleBlockUser);
router.patch("/users/:id/promote", promoteUser);

// ================= SESSIONS =================
router.get("/sessions", getAllSessions);
router.get("/sessions/:id", getSessionDetails);
router.delete("/sessions/:id", deleteSessionAdmin);

// ================= ANALYTICS =================
router.get("/analytics", getAnalytics);

export default router;
