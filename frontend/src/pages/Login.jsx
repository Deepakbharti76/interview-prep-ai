import { useState } from "react";
import axios from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { BsLightningChargeFill } from "react-icons/bs";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      toast.error("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(API_PATHS.AUTH.LOGIN, form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login successful! Welcome back.");

      setTimeout(() => {
        navigate("/dashboard");
      }, 500); // smooth UX
    } catch (err) {
      const msg = err?.response?.data?.message;
      toast.error(msg || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-orange-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        {/* LOGO */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center">
            <BsLightningChargeFill className="text-white" size={18} />
          </div>
          <span className="text-xl font-bold">Interview Prep AI</span>
        </div>

        <h2 className="text-2xl font-bold text-center mb-1">Welcome Back 👋</h2>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Login to continue your interview preparation
        </p>

        <div className="space-y-4">
          {/* EMAIL */}
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            onKeyDown={handleKeyDown}
          />

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full border border-gray-200 rounded-xl p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onKeyDown={handleKeyDown}
            />

            {/* SINGLE ICON ONLY */}
            <div
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
            >
              {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-gray-700 disabled:opacity-60 text-white py-3 rounded-xl transition font-medium text-sm"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-gray-100" />
          <p className="px-3 text-gray-400 text-xs">OR</p>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-orange-500 font-medium hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
