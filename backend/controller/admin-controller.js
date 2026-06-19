import User from "../models/user-model.js";
import Session from "../models/session-model.js";
import Question from "../models/question-model.js";

// ================= DASHBOARD STATS =================
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSessions = await Session.countDocuments();
    const totalQuestions = await Question.countDocuments();

    // "Active" = not blocked AND logged in within the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const totalActiveUsers = await User.countDocuments({
      isBlocked: false,
      lastLogin: { $gte: thirtyDaysAgo },
    });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalSessions,
        totalQuestions,
        totalActiveUsers,
      },
    });
  } catch (error) {
    console.error("ADMIN DASHBOARD ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= GET ALL USERS =================
export const getAllUsers = async (req, res) => {
  try {
    const { search } = req.query;

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // 🔒 NEVER expose passwords, even hashed ones
    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("GET ALL USERS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= GET SINGLE USER DETAILS =================
export const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const sessions = await Session.find({ user: id })
      .select("role experience questions createdAt")
      .sort({ createdAt: -1 });

    const sessionsSummary = sessions.map((s) => ({
      _id: s._id,
      role: s.role,
      experience: s.experience,
      questionsCount: s.questions.length,
      createdAt: s.createdAt,
    }));

    res.status(200).json({
      success: true,
      user,
      sessions: sessionsSummary,
    });
  } catch (error) {
    console.error("GET USER DETAILS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= DELETE USER =================
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own admin account.",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Cascade delete: remove this user's sessions & questions too
    const sessions = await Session.find({ user: id }).select("_id");
    const sessionIds = sessions.map((s) => s._id);

    await Question.deleteMany({ session: { $in: sessionIds } });
    await Session.deleteMany({ user: id });
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User and all associated data deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= BLOCK / UNBLOCK USER =================
export const toggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot block your own admin account.",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      success: true,
      message: user.isBlocked ? "User has been blocked." : "User has been unblocked.",
      user: {
        _id: user._id,
        isBlocked: user.isBlocked,
      },
    });
  } catch (error) {
    console.error("BLOCK USER ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= PROMOTE USER TO ADMIN =================
export const promoteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "User is already an admin.",
      });
    }

    user.role = "admin";
    await user.save();

    res.status(200).json({
      success: true,
      message: `${user.name} has been promoted to admin.`,
      user: { _id: user._id, role: user.role },
    });
  } catch (error) {
    console.error("PROMOTE USER ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= GET ALL SESSIONS (ADMIN) =================
export const getAllSessions = async (req, res) => {
  try {
    const { search } = req.query;

    let sessions = await Session.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    if (search) {
      const regex = new RegExp(search, "i");
      sessions = sessions.filter(
        (s) =>
          regex.test(s.user?.name || "") ||
          regex.test(s.role || "") ||
          regex.test(s.user?.email || ""),
      );
    }

    const formatted = sessions.map((s) => ({
      _id: s._id,
      userName: s.user?.name || "Deleted User",
      userEmail: s.user?.email || "-",
      role: s.role,
      experience: s.experience,
      questionsCount: s.questions.length,
      createdAt: s.createdAt,
    }));

    res.status(200).json({ success: true, sessions: formatted });
  } catch (error) {
    console.error("GET ALL SESSIONS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= GET SESSION DETAILS (ADMIN) =================
export const getSessionDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await Session.findById(id)
      .populate("user", "name email")
      .populate("questions");

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    res.status(200).json({ success: true, session });
  } catch (error) {
    console.error("GET SESSION DETAILS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= DELETE SESSION (ADMIN) =================
export const deleteSessionAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    await Question.deleteMany({ session: id });
    await Session.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Session deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE SESSION ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= ANALYTICS =================
export const getAnalytics = async (req, res) => {
  try {
    // ---- Daily Registrations (last 14 days) ----
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 13);
    fourteenDaysAgo.setHours(0, 0, 0, 0);

    const regsRaw = await User.aggregate([
      { $match: { createdAt: { $gte: fourteenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
    ]);

    const regsMap = {};
    regsRaw.forEach((r) => (regsMap[r._id] = r.count));

    const dailyRegistrations = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(fourteenDaysAgo);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      dailyRegistrations.push({
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        count: regsMap[key] || 0,
      });
    }

    // ---- Weekly Sessions (last 8 weeks) ----
    const eightWeeksAgo = new Date();
    eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 55);
    eightWeeksAgo.setHours(0, 0, 0, 0);

    const sessionsRaw = await Session.find({
      createdAt: { $gte: eightWeeksAgo },
    }).select("createdAt");

    const weeklySessions = [];
    for (let i = 0; i < 8; i++) {
      const weekStart = new Date(eightWeeksAgo);
      weekStart.setDate(weekStart.getDate() + i * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      const count = sessionsRaw.filter(
        (s) => s.createdAt >= weekStart && s.createdAt < weekEnd,
      ).length;

      weeklySessions.push({
        week: weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        count,
      });
    }

    // ---- Total Questions Generated ----
    const totalQuestionsGenerated = await Question.countDocuments();

    // ---- Most Popular Roles ----
    const popularRolesRaw = await Session.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const popularRoles = popularRolesRaw.map((r) => ({
      role: r._id,
      count: r.count,
    }));

    res.status(200).json({
      success: true,
      dailyRegistrations,
      weeklySessions,
      totalQuestionsGenerated,
      popularRoles,
    });
  } catch (error) {
    console.error("ANALYTICS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
