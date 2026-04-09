import Question from "../models/question-model.js";
import Session from "../models/session-model.js";

// ================= CREATE =================
export const createSession = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, description } = req.body;
    const userId = req.user._id;

    const session = await Session.create({
      user: userId,
      role,
      experience,
      topicsToFocus,
      description,
    });

    res.status(201).json({ success: true, session });
  } catch (error) {
    console.error("CREATE ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= GET ALL =================
export const getMySessions = async (req, res) => {
  try {
    const { search } = req.query;

    const query = {
      user: req.user._id,
      ...(search && { role: { $regex: search, $options: "i" } }),
    };

    const sessions = await Session.find(query)
      .sort({ createdAt: -1 })
      .populate("questions");

    res.status(200).json({ success: true, sessions });
  } catch (error) {
    console.error("GET ALL ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= GET ONE =================
export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate("questions")
      .populate("user", "name email");

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    if (session.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    res.status(200).json({ success: true, session });
  } catch (error) {
    console.error("GET ONE ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= DELETE =================
export const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await Question.deleteMany({ session: id });
    await Session.findByIdAndDelete(id);

    res.json({ success: true, message: "Session deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= PIN / UNPIN =================
export const togglePin = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    const session = await Session.findById(question.session);

    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    question.isPinned = !question.isPinned;
    await question.save();

    res.json({ success: true, question });
  } catch (err) {
    console.error("PIN ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
