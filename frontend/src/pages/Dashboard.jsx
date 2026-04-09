import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../utils/apiPaths";
import axios from "../utils/axiosInstance";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import moment from "moment";
import { FiSearch, FiPlus, FiTrash2, FiArrowRight } from "react-icons/fi";
import { BsLightningChargeFill } from "react-icons/bs";

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [topicsToFocus, setTopicsToFocus] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_PATHS.SESSION.GET_ALL}?search=${search}`);
      setSessions(res.data.sessions || []);
    } catch {
      toast.error("Failed to load sessions.");
    } finally {
      setLoading(false);
    }
  };

  const createSession = async () => {
    if (!role.trim() || !experience.trim()) {
      toast.error("Role and Experience are required.");
      return;
    }
    try {
      setCreating(true);
      await axios.post(API_PATHS.SESSION.CREATE, {
        role,
        experience,
        topicsToFocus,
        description,
        questions: [],
      });
      toast.success("Session created successfully!");
      setRole("");
      setExperience("");
      setTopicsToFocus("");
      setDescription("");
      setShowForm(false);
      fetchSessions();
    } catch {
      toast.error("Failed to create session. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    toast(
      (t) => (
        <span className="flex items-center gap-3">
          <span className="text-sm font-medium">Delete this session?</span>
          <button
            className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-medium"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await axios.delete(`${API_PATHS.SESSION.DELETE}/${id}`);
                toast.success("Session deleted successfully.");
                fetchSessions();
              } catch {
                toast.error("Failed to delete session.");
              }
            }}
          >
            Delete
          </button>
          <button
            className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-xs font-medium"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </span>
      ),
      { duration: 6000 }
    );
  };

  useEffect(() => {
    const timer = setTimeout(fetchSessions, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 pt-10 pb-20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Sessions</h1>
            <p className="text-gray-500 text-sm mt-1">
              {sessions.length} session{sessions.length !== 1 ? "s" : ""} total
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl font-medium transition"
          >
            <FiPlus /> New Session
          </button>
        </div>

        <div className="relative mb-6">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Search by role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 bg-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-sm"
          />
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8"
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BsLightningChargeFill className="text-orange-500" />
                Create New Session
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  placeholder="Job Role (e.g. Frontend Developer)"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                />
                <input
                  placeholder="Experience (e.g. 2 years / Fresher)"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                />
                <input
                  placeholder="Topics to Focus (e.g. React, Node.js)"
                  value={topicsToFocus}
                  onChange={(e) => setTopicsToFocus(e.target.value)}
                  className="border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                />
                <input
                  placeholder="Description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={createSession}
                  disabled={creating}
                  className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-6 py-2 rounded-xl font-medium transition text-sm"
                >
                  {creating ? "Creating..." : "+ Create Session"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-5 animate-pulse h-40 shadow-sm" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-gray-500 text-lg font-medium">No sessions found</p>
            <p className="text-gray-400 text-sm mt-1">
              Click "New Session" to create your first interview session.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            <AnimatePresence>
              {sessions.map((s) => (
                <motion.div
                  key={s._id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => navigate(`/interview/${s._id}`)}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all relative group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 pr-2">
                      <h2 className="text-base font-semibold text-gray-900 truncate">
                        {s.role}
                      </h2>
                      <p className="text-gray-400 text-sm">{s.experience}</p>
                      {s.topicsToFocus && (
                        <p className="text-xs text-orange-500 mt-1 truncate">
                          {s.topicsToFocus}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, s._id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50"
                      title="Delete"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                    <span className="text-xs text-gray-400">
                      {moment(s.createdAt).fromNow()}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-400">
                        {s.questions?.length || 0} Q's
                      </span>
                      <FiArrowRight size={12} className="text-orange-400" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
