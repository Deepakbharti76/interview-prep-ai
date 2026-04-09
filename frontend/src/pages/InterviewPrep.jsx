import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import QAItem from "../components/QAItems";
import Navbar from "../components/Navbar";
import SkeletonCard from "../components/SkeletonCard";
import ErrorBanner from "../components/ErrorBanner";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { BsLightningChargeFill } from "react-icons/bs";
import { FiArrowLeft, FiRefreshCw } from "react-icons/fi";
import { TbBulb } from "react-icons/tb";
import { ImSpinner8 } from "react-icons/im";

const InterviewPrep = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  const fetchSession = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      setError(null);
      const res = await axios.get(`${API_PATHS.SESSION.GET_ONE}/${id}`);
      const sess = res.data.session;
      setSession(sess);
      const data = [...(sess?.questions || [])].sort(
        (a, b) => b.isPinned - a.isPinned
      );
      setQuestions(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load session.");
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  const generateQuestions = async () => {
    try {
      setGenerating(true);
      const toastId = toast.loading("Generating questions with AI...");
      const res = await axios.post(API_PATHS.AI.GENERATE_QUESTIONS, {
        sessionId: id,
      });
      toast.success("Questions generated successfully!", { id: toastId });
      // Use the returned questions directly for instant UI update
      const newQuestions = res.data.questions || [];
      setQuestions(newQuestions.sort((a, b) => b.isPinned - a.isPinned));
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Could not generate questions. Please try again.";
      toast.error(msg);
    } finally {
      setGenerating(false);
    }
  };

  const handlePin = async (questionId) => {
    try {
      await axios.patch(`${API_PATHS.QUESTIONS.PIN}/${questionId}`);
      setQuestions((prev) => {
        const updated = prev.map((q) =>
          q._id === questionId ? { ...q, isPinned: !q.isPinned } : q
        );
        return [...updated].sort((a, b) => b.isPinned - a.isPinned);
      });
    } catch {
      toast.error("Failed to update pin.");
    }
  };

  const handleExplain = async (question) => {
    const toastId = toast.loading("Getting AI explanation...");
    try {
      const res = await axios.post(API_PATHS.AI.EXPLAIN, { question });
      toast.dismiss(toastId);
      return res.data.explanation;
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Could not get explanation. Please try again.";
      toast.error(msg, { id: toastId });
      return null;
    }
  };

  useEffect(() => {
    fetchSession();
  }, [id]);

  const displayedQuestions =
    filter === "pinned" ? questions.filter((q) => q.isPinned) : questions;

  const hasQuestions = questions.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 pt-8 pb-20">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-5 transition"
        >
          <FiArrowLeft size={14} /> Back to Dashboard
        </button>

        <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {session?.role || "Interview Session"}
            </h1>
            {session?.experience && (
              <p className="text-sm text-gray-500 mt-0.5">
                {session.experience}
                {session.topicsToFocus && ` · ${session.topicsToFocus}`}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              {questions.length} question{questions.length !== 1 ? "s" : ""}
              {questions.filter((q) => q.isPinned).length > 0 &&
                ` · ${questions.filter((q) => q.isPinned).length} pinned`}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {hasQuestions && (
              <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1">
                {["all", "pinned"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                      filter === f
                        ? "bg-orange-500 text-white"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {f === "all" ? "All" : "📌 Pinned"}
                  </button>
                ))}
              </div>
            )}

            {hasQuestions && (
              <button
                onClick={() => fetchSession(false)}
                className="p-2 rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition"
                title="Refresh"
              >
                <FiRefreshCw size={15} />
              </button>
            )}

            <button
              onClick={generateQuestions}
              disabled={generating}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white px-4 py-2 rounded-xl font-medium transition shadow-sm text-sm"
            >
              {generating ? (
                <ImSpinner8 className="animate-spin" size={14} />
              ) : (
                <BsLightningChargeFill size={13} />
              )}
              {generating
                ? "Generating..."
                : hasQuestions
                ? "Regenerate Questions"
                : "Generate Questions"}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorBanner message={error} onRetry={fetchSession} />
        ) : !hasQuestions ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center">
              <TbBulb className="w-7 h-7 text-orange-400" />
            </div>
            <div>
              <p className="text-gray-700 font-semibold text-base">
                No questions yet
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Click "Generate Questions" above to get AI-powered interview
                questions.
              </p>
            </div>
          </div>
        ) : displayedQuestions.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">
              No pinned questions yet. Click the pin icon on any question to pin
              it.
            </p>
          </div>
        ) : (
          <motion.div className="space-y-3">
            {displayedQuestions.map((q, i) => (
              <motion.div
                key={q._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <QAItem item={q} onPin={handlePin} onExplain={handleExplain} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default InterviewPrep;
