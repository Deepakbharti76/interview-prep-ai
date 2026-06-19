import { useNavigate } from "react-router-dom";
import { BsLightningChargeFill } from "react-icons/bs";
import { FiLogOut, FiGrid, FiShield } from "react-icons/fi";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="flex justify-between items-center px-6 py-3.5 shadow-sm bg-white border-b border-gray-100 sticky top-0 z-50">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
          <BsLightningChargeFill className="text-white" size={14} />
        </div>
        <h1 className="text-lg font-bold text-gray-900">Interview Prep AI</h1>
      </div>

      <div className="flex items-center gap-3">
        {user?.name && (
          <span className="text-sm text-gray-500 hidden sm:block">
            Hi, {user.name.split(" ")[0]} 👋
          </span>
        )}

        {/* 🔒 ADMIN PANEL: only visible to admin users */}
        {user?.role === "admin" && (
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition"
          >
            <FiShield size={14} />
            <span className="hidden sm:block">Admin Panel</span>
          </button>
        )}

        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
        >
          <FiGrid size={14} />
          <span className="hidden sm:block">Dashboard</span>
        </button>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-gray-700 transition"
        >
          <FiLogOut size={14} />
          <span className="hidden sm:block">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
