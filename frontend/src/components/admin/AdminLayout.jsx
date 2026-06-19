import { useNavigate, useLocation } from "react-router-dom";
import { BsLightningChargeFill } from "react-icons/bs";
import {
  FiGrid,
  FiUsers,
  FiFileText,
  FiBarChart2,
  FiLogOut,
  FiArrowLeft,
} from "react-icons/fi";

const navItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: FiGrid },
  { label: "Users", path: "/admin/users", icon: FiUsers },
  { label: "Sessions", path: "/admin/sessions", icon: FiFileText },
  { label: "Analytics", path: "/admin/analytics", icon: FiBarChart2 },
];

const AdminLayout = ({ children, title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar (desktop) */}
      <aside className="w-60 bg-gray-900 text-white flex-col shrink-0 hidden md:flex">
        <div className="flex items-center gap-2 px-5 py-5 border-b border-gray-800">
          <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
            <BsLightningChargeFill className="text-white" size={14} />
          </div>
          <span className="font-bold text-sm">Admin Panel</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  active
                    ? "bg-orange-500 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-gray-800 space-y-1">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition"
          >
            <FiArrowLeft size={16} />
            Back to App
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition"
          >
            <FiLogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Signed in as {user?.name || "Admin"}
            </p>
          </div>

          {/* Mobile nav (sidebar hidden on small screens) */}
          <div className="flex md:hidden items-center gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`p-2 rounded-lg transition ${
                    active ? "bg-orange-500 text-white" : "text-gray-500"
                  }`}
                  title={item.label}
                >
                  <Icon size={16} />
                </button>
              );
            })}
            <button
              onClick={logout}
              className="p-2 rounded-lg text-red-500"
              title="Logout"
            >
              <FiLogOut size={16} />
            </button>
          </div>
        </div>

        <div className="p-5 md:p-8">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
