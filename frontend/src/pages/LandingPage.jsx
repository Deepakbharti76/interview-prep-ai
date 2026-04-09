import { useNavigate } from "react-router-dom";
import { BsLightningChargeFill } from "react-icons/bs";
import { FiCheckCircle } from "react-icons/fi";

const features = [
  "AI-generated role-specific questions",
  "Pinned questions for quick review",
  "Concept explanations on demand",
  "Multiple sessions for different roles",
];

const LandingPage = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 flex flex-col">
      <div className="flex justify-between items-center px-6 py-4 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
            <BsLightningChargeFill className="text-white" size={14} />
          </div>
          <span className="font-bold text-lg">Interview Prep AI</span>
        </div>
        <div className="flex gap-3">
          {isLoggedIn ? (
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-700 transition"
            >
              Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="text-gray-600 px-4 py-2 rounded-xl text-sm hover:bg-gray-100 transition"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-700 transition"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center text-center px-4 py-20">
        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          <BsLightningChargeFill size={11} />
          AI-Powered Interview Prep
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-gray-900">
          Ace Interviews with{" "}
          <span className="text-orange-500">AI-Powered</span>{" "}
          Learning
        </h1>

        <p className="text-gray-500 max-w-xl mb-8 text-lg leading-relaxed">
          Generate role-specific questions, get concept explanations, pin important Q&As,
          and master your interviews with AI assistance.
        </p>

        <div className="flex gap-3 flex-wrap justify-center mb-12">
          <button
            onClick={() => navigate(isLoggedIn ? "/dashboard" : "/login")}
            className="bg-gray-900 text-white px-8 py-3.5 rounded-xl hover:scale-105 transition font-medium shadow-lg"
          >
            Get Started Free
          </button>
          {!isLoggedIn && (
            <button
              onClick={() => navigate("/signup")}
              className="bg-white border border-gray-200 text-gray-700 px-8 py-3.5 rounded-xl hover:bg-gray-50 transition font-medium"
            >
              Create Account
            </button>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-3 max-w-lg text-left">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-2.5 bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm">
              <FiCheckCircle className="text-green-500 shrink-0" size={16} />
              <span className="text-sm text-gray-700">{f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
