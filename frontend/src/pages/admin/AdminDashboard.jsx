import { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import AdminLayout from "../../components/admin/AdminLayout";
import toast from "react-hot-toast";
import { FiUsers, FiFileText, FiHelpCircle, FiUserCheck } from "react-icons/fi";

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
      <Icon size={20} className="text-white" />
    </div>
    <div className="min-w-0">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 truncate">{label}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_PATHS.ADMIN.DASHBOARD);
      setStats(res.data.stats);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load dashboard stats.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <AdminLayout title="Dashboard">
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 h-24 animate-pulse shadow-sm" />
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            icon={FiUsers}
            label="Total Users"
            value={stats?.totalUsers ?? 0}
            color="bg-blue-500"
          />
          <StatCard
            icon={FiFileText}
            label="Total Interview Sessions"
            value={stats?.totalSessions ?? 0}
            color="bg-orange-500"
          />
          <StatCard
            icon={FiHelpCircle}
            label="Total Questions Generated"
            value={stats?.totalQuestions ?? 0}
            color="bg-purple-500"
          />
          <StatCard
            icon={FiUserCheck}
            label="Total Active Users"
            value={stats?.totalActiveUsers ?? 0}
            color="bg-green-500"
          />
        </div>
      )}

      <div className="mt-6 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <p className="text-sm text-gray-500">
          <span className="font-medium text-gray-700">Active Users</span> counts
          users who are not blocked and have logged in within the last 30 days.
        </p>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
