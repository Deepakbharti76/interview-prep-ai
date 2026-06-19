import dotenv from "dotenv";
dotenv.config({ quiet: true });

import express from "express";
import cors from "cors";
import path from "node:path";

import { connectDB } from "./config/database-config.js";

// 🔥 routes
import authRoutes from "./routes/auth-route.js";
import sessionRoutes from "./routes/session-route.js";
import questionRoutes from "./routes/question-route.js";
import aiRoutes from "./routes/ai-route.js"; // ✅ ADD THIS
import adminRoutes from "./routes/admin-route.js"; // ✅ ADMIN PANEL

// 🔥 middleware
import { protect } from "./middlewares/auth-middleware.js";

const app = express();

// ================= DB =================
connectDB();

// // // ================= CORS =================
// // const allowedOrigins = [
// //   "http://localhost:5173",
// //   "https://interview-prep-ai-roan.vercel.app",
// // ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     methods: ["GET", "POST", "PATCH", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   }),
// );

// ================= CORS =================
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ================= MIDDLEWARE =================
app.use(express.json());

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/questions", questionRoutes);

// 🔥 AI ROUTES (BEST PRACTICE)
app.use("/api/ai", aiRoutes);

// 🔥 ADMIN PANEL ROUTES
app.use("/api/admin", adminRoutes);

// ❌ REMOVE THESE (duplicate थे)
// app.use("/api/ai/generate-questions", protect, generateInterviewQuestions);
// app.use("/api/ai/generate-explanation", protect, generateConceptExplanation);

// ================= STATIC =================
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ================= HOME ROUTE =================
app.get("/", (req, res) => {
  res.send("Interview Prep AI Backend is Running 🚀");
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
