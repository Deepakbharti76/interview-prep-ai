import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_PATHS } from "../utils/apiPaths";
import axios from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { BsLightningChargeFill } from "react-icons/bs";
import { FiEye, FiEyeOff } from "react-icons/fi";

const SignUp = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password) {
      toast.error("All fields are required");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      await axios.post(API_PATHS.AUTH.SIGNUP, form);

      toast.success("Account created successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 500);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
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

        <h2 className="text-2xl font-bold text-center mb-1">
          Create Account 🚀
        </h2>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Start your AI-powered interview preparation
        </p>

        <div className="space-y-4">
          {/* NAME */}
          <input
            type="text"
            placeholder="Your full name"
            className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Your email address"
            className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Create a password (min 6 chars)"
              className="w-full border border-gray-200 rounded-xl p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            {/* SINGLE ICON */}
            <div
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
            >
              {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-gray-700 disabled:opacity-60 text-white py-3 rounded-xl transition font-medium text-sm"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </div>

        <p className="text-center mt-5 text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-orange-500 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
