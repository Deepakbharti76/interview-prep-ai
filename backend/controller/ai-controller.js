import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";
import Question from "../models/question-model.js";
import Session from "../models/session-model.js";
import {
  conceptExplainPrompt,
  questionAnswerPrompt,
} from "../utils/prompts-util.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const callGeminiWithRetry = async (prompt, mimeType = null, retries = 2) => {
  const config = {};
  if (mimeType) {
    config.responseMimeType = mimeType;
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash", // ✅ FIXED
        contents: prompt,
      });
      return response;
    } catch (err) {
      const isRetryable =
        err?.message?.includes("503") ||
        err?.message?.includes("overloaded") ||
        err?.message?.includes("unavailable") ||
        err?.message?.includes("500");

      if (isRetryable && attempt < retries) {
        await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
};

const getFriendlyAIError = (error) => {
  const msg = (error?.message || "").toLowerCase();
  if (
    msg.includes("503") ||
    msg.includes("overloaded") ||
    msg.includes("unavailable") ||
    msg.includes("500")
  ) {
    return "AI service is temporarily unavailable. Please try again in a minute.";
  }
  if (msg.includes("429") || msg.includes("quota") || msg.includes("rate")) {
    return "Too many requests. Please wait a moment and try again.";
  }
  if (
    msg.includes("401") ||
    msg.includes("api key") ||
    msg.includes("unauthorized")
  ) {
    return "AI configuration error. Please check your API key.";
  }
  if (msg.includes("timeout") || msg.includes("network")) {
    return "Network error. Please check your connection and try again.";
  }
  return "Could not generate questions. Please try again.";
};

// ================= GENERATE QUESTIONS =================
export const generateInterviewQuestions = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res
        .status(400)
        .json({ success: false, message: "sessionId is required" });
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    if (session.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    const { role, experience, topicsToFocus } = session;
    const safeTopics = topicsToFocus || role;
    const prompt = questionAnswerPrompt(role, experience, safeTopics, 10);

    const response = await callGeminiWithRetry(prompt, "application/json");

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    let rawText = parts.map((p) => p.text ?? "").join("");

    rawText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      const match = rawText.match(/\[[\s\S]*\]/);
      if (!match) {
        return res.status(500).json({
          success: false,
          message: "AI returned an unexpected format. Please try again.",
        });
      }
      parsed = JSON.parse(match[0]);
    }

    let questions = [];
    if (Array.isArray(parsed)) {
      questions = parsed;
    } else if (parsed.questions && Array.isArray(parsed.questions)) {
      questions = parsed.questions;
    } else {
      return res.status(500).json({
        success: false,
        message: "AI returned an unexpected format. Please try again.",
      });
    }

    await Question.deleteMany({ session: sessionId });
    session.questions = [];
    await session.save();

    const saved = await Question.insertMany(
      questions.map((q) => ({
        session: sessionId,
        question: q.question,
        answer: q.answer || "",
        note: "",
        isPinned: false,
      })),
    );

    session.questions = saved.map((q) => q._id);
    await session.save();

    res.status(201).json({ success: true, questions: saved });
  } catch (error) {
    console.error("AI GENERATE ERROR:", error?.message);
    res.status(500).json({
      success: false,
      message: getFriendlyAIError(error),
    });
  }
};

// ================= EXPLAIN =================
export const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res
        .status(400)
        .json({ success: false, message: "Question is required" });
    }

    const prompt = conceptExplainPrompt(question);
    const response = await callGeminiWithRetry(prompt);

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    const explanation = parts.map((p) => p.text ?? "").join("");

    res.json({ success: true, explanation });
  } catch (error) {
    console.error("EXPLAIN ERROR:", error?.message);
    res.status(500).json({
      success: false,
      message: getFriendlyAIError(error),
    });
  }
};
