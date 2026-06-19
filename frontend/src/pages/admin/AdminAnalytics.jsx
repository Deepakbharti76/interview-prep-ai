import { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import AdminLayout from "../../components/admin/AdminLayout";
import toast from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { FiHelpCircle } from "react-icons/fi";

const COLORS = ["#f97316", "#6366f1", "#10b981", "#3b82f6", "#ec4899"];

const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_PATHS.ADMIN.ANALYTICS);
      setData(res.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Analytics">
        <div className="grid lg:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 h-72 animate-pulse shadow-sm" />
          ))}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Analytics">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center shrink-0">
          <FiHelpCircle size={20} className="text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">
            {data?.totalQuestionsGenerated ?? 0}
          </p>
          <p className="text-sm text-gray-500">Total Questions Generated</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-1">Daily Registrations</h3>
          <p className="text-xs text-gray-400 mb-4">Last 14 days</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data?.dailyRegistrations || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" name="New Users" fill="#f97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-1">Weekly Sessions</h3>
          <p className="text-xs text-gray-400 mb-4">Last 8 weeks</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data?.weeklySessions || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" name="Sessions" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="font-semibold text-gray-800 mb-1">Most Popular Roles</h3>
          <p className="text-xs text-gray-400 mb-4">Top 5 roles by session count</p>
          {data?.popularRoles?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.popularRoles}
                  dataKey="count"
                  nameKey="role"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ role, count }) => `${role}: ${count}`}
                >
                  {data.popularRoles.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-400 text-center py-10">
              No session data available yet.
            </p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
