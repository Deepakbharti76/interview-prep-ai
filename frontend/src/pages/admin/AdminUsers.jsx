import { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import AdminLayout from "../../components/admin/AdminLayout";
import toast from "react-hot-toast";
import moment from "moment";
import {
  FiSearch,
  FiEye,
  FiTrash2,
  FiLock,
  FiUnlock,
  FiArrowUpCircle,
  FiX,
} from "react-icons/fi";

const StatusBadge = ({ isBlocked }) => (
  <span
    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
      isBlocked ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
    }`}
  >
    {isBlocked ? "Blocked" : "Active"}
  </span>
);

const RoleBadge = ({ role }) => (
  <span
    className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
      role === "admin" ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-600"
    }`}
  >
    {role}
  </span>
);

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const [selectedUser, setSelectedUser] = useState(null);
  const [userSessions, setUserSessions] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_PATHS.ADMIN.USERS}?search=${search}`);
      setUsers(res.data.users || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const viewUser = async (id) => {
    try {
      setDetailsLoading(true);
      setSelectedUser({}); // open modal immediately with loader
      const res = await axios.get(`${API_PATHS.ADMIN.USERS}/${id}`);
      setSelectedUser(res.data.user);
      setUserSessions(res.data.sessions || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load user details.");
      setSelectedUser(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedUser(null);
    setUserSessions([]);
  };

  const handleDelete = (id, name) => {
    toast(
      (t) => (
        <span className="flex items-center gap-3">
          <span className="text-sm font-medium">Delete {name}?</span>
          <button
            className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-medium"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                setActionId(id);
                await axios.delete(`${API_PATHS.ADMIN.USERS}/${id}`);
                toast.success("User deleted successfully.");
                fetchUsers();
              } catch (err) {
                toast.error(err?.response?.data?.message || "Failed to delete user.");
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

  const handleBlockToggle = async (id) => {
    try {
      setActionId(id);
      const res = await axios.patch(`${API_PATHS.ADMIN.USERS}/${id}/block`);
      toast.success(res.data.message);
      fetchUsers();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update user status.");
    } finally {
      setActionId(null);
    }
  };

  const handlePromote = async (id) => {
    try {
      setActionId(id);
      const res = await axios.patch(`${API_PATHS.ADMIN.USERS}/${id}/promote`);
      toast.success(res.data.message);
      fetchUsers();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to promote user.");
    } finally {
      setActionId(null);
    }
  };

  return (
    <AdminLayout title="Users Management">
      <div className="relative mb-5 max-w-md">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          placeholder="Search by name or email..."
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
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Registered</th>
                <th className="px-5 py-3 font-medium">Last Login</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [1, 2, 3, 4].map((i) => (
                  <tr key={i}>
                    <td colSpan={7} className="px-5 py-4">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-gray-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-5 py-3.5 font-medium text-gray-800">{u.name}</td>
                    <td className="px-5 py-3.5 text-gray-500">{u.email}</td>
                    <td className="px-5 py-3.5">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">
                      {moment(u.createdAt).format("DD MMM YYYY")}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">
                      {u.lastLogin ? moment(u.lastLogin).fromNow() : "Never"}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge isBlocked={u.isBlocked} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => viewUser(u._id)}
                          className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition"
                          title="View Details"
                        >
                          <FiEye size={15} />
                        </button>
                        <button
                          onClick={() => handleBlockToggle(u._id)}
                          disabled={actionId === u._id}
                          className={`p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition ${
                            u.isBlocked ? "text-green-500" : "text-yellow-500"
                          }`}
                          title={u.isBlocked ? "Unblock User" : "Block User"}
                        >
                          {u.isBlocked ? <FiUnlock size={15} /> : <FiLock size={15} />}
                        </button>
                        {u.role !== "admin" && (
                          <button
                            onClick={() => handlePromote(u._id)}
                            disabled={actionId === u._id}
                            className="p-1.5 rounded-lg text-indigo-500 hover:bg-indigo-50 disabled:opacity-50 transition"
                            title="Promote to Admin"
                          >
                            <FiArrowUpCircle size={15} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(u._id, u.name)}
                          disabled={actionId === u._id}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-50 transition"
                          title="Delete User"
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

      {/* View User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
              <h3 className="font-semibold text-gray-900">User Details</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
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
                  <div className="space-y-2.5 mb-5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Name</span>
                      <span className="font-medium text-gray-800">{selectedUser.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Email</span>
                      <span className="font-medium text-gray-800">{selectedUser.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Role</span>
                      <RoleBadge role={selectedUser.role} />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Status</span>
                      <StatusBadge isBlocked={selectedUser.isBlocked} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Registered</span>
                      <span className="font-medium text-gray-800">
                        {moment(selectedUser.createdAt).format("DD MMM YYYY")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Last Login</span>
                      <span className="font-medium text-gray-800">
                        {selectedUser.lastLogin
                          ? moment(selectedUser.lastLogin).format("DD MMM YYYY, h:mm A")
                          : "Never"}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    Interview Sessions ({userSessions.length})
                  </p>
                  {userSessions.length === 0 ? (
                    <p className="text-sm text-gray-400">No sessions created yet.</p>
                  ) : (
                    <div className="space-y-2 max-h-52 overflow-y-auto">
                      {userSessions.map((s) => (
                        <div
                          key={s._id}
                          className="border border-gray-100 rounded-xl px-3.5 py-2.5 text-sm"
                        >
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-800">{s.role}</span>
                            <span className="text-gray-400 text-xs">
                              {moment(s.createdAt).format("DD MMM YYYY")}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {s.experience} · {s.questionsCount} questions
                          </p>
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

export default AdminUsers;
