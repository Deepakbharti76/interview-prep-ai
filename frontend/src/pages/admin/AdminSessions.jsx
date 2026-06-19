import { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import AdminLayout from "../../components/admin/AdminLayout";
import toast from "react-hot-toast";
import moment from "moment";
import { FiSearch, FiEye, FiTrash2, FiX } from "react-icons/fi";

const AdminSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const [selectedSession, setSelectedSession] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_PATHS.ADMIN.SESSIONS}?search=${search}`);
      setSessions(res.data.sessions || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load sessions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchSessions, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const viewSession = async (id) => {
    try {
      setDetailsLoading(true);
      setSelectedSession({});
      const res = await axios.get(`${API_PATHS.ADMIN.SESSIONS}/${id}`);
      setSelectedSession(res.data.session);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load session.");
      setSelectedSession(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleDelete = (id) => {
    toast(
      (t) => (
        <span className="flex items-center gap-3">
          <span className="text-sm font-medium">Delete this session?</span>
          <button
            className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-medium"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                setActionId(id);
                await axios.delete(`${API_PATHS.ADMIN.SESSIONS}/${id}`);
                toast.success("Session deleted successfully.");
                fetchSessions();
              } catch (err) {
                toast.error(err?.response?.data?.message || "Failed to delete session.");
              } finally {
                setActionId(null);
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
      { duration: 6000 },
    );
  };

  return (
    <AdminLayout title="Sessions Management">
      <div className="relative mb-5 max-w-md">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          placeholder="Search by user name, email, or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-200 bg-white pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-sm text-sm"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wide">
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Experience</th>
                <th className="px-5 py-3 font-medium">Questions</th>
                <th className="px-5 py-3 font-medium">Created</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [1, 2, 3, 4].map((i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-5 py-4">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : sessions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-gray-400">
                    No sessions found.
                  </td>
                </tr>
              ) : (
                sessions.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-gray-800">{s.userName}</p>
                      <p className="text-xs text-gray-400">{s.userEmail}</p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{s.role}</td>
                    <td className="px-5 py-3.5 text-gray-500">{s.experience}</td>
                    <td className="px-5 py-3.5 text-gray-500">{s.questionsCount}</td>
                    <td className="px-5 py-3.5 text-gray-500">
                      {moment(s.createdAt).format("DD MMM YYYY")}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => viewSession(s._id)}
                          className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition"
                          title="View Details"
                        >
                          <FiEye size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(s._id)}
                          disabled={actionId === s._id}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-50 transition"
                          title="Delete Session"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Session Details Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
              <h3 className="font-semibold text-gray-900">Session Details</h3>
              <button
                onClick={() => setSelectedSession(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="p-6">
              {detailsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-4 bg-gray-100 rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                <>
                  <div className="mb-5">
                    <h4 className="font-semibold text-gray-900">{selectedSession.role}</h4>
                    <p className="text-sm text-gray-500">
                      {selectedSession.experience} · Created by{" "}
                      {selectedSession.user?.name || "Deleted User"}
                      {selectedSession.user?.email && ` (${selectedSession.user.email})`}
                    </p>
                    {selectedSession.topicsToFocus && (
                      <p className="text-xs text-orange-500 mt-1">
                        {selectedSession.topicsToFocus}
                      </p>
                    )}
                  </div>

                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    Questions ({selectedSession.questions?.length || 0})
                  </p>

                  {(selectedSession.questions || []).length === 0 ? (
                    <p className="text-sm text-gray-400">
                      No questions generated for this session yet.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {selectedSession.questions.map((q, i) => (
                        <div
                          key={q._id || i}
                          className="border border-gray-100 rounded-xl px-3.5 py-3 text-sm"
                        >
                          <p className="font-medium text-gray-800">
                            {i + 1}. {q.question}
                          </p>
                          {q.isPinned && (
                            <span className="text-xs text-orange-500">📌 Pinned</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminSessions;
