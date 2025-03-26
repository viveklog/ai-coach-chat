import { useState } from "react";
import { signup, login } from "../api/auth";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";
import LoadingAnimation from "../components/UI/LoadingAnimation";
export default function AuthPage() {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const auth = useAuthStore();
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      let data;
      if (isSignup) {
        data = await signup(username, fullName);
      } else {
        data = await login(username);
      }
      auth.login(data.token, data.user_id,);
      setLoading(false);
      navigate("/chat"); // Redirect to chat page after authentication
    } catch (err) {
      setLoading(false)
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-gray-100">
      <form onSubmit={handleAuth} className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">{isSignup ? "Sign Up" : "Login"}</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          required
        />
        {isSignup && (
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            required
          />
        )}
        {loading && <div className="flex items-center justify-center p-5 ">
          <LoadingAnimation />
          </div>}
        <button className="w-full bg-blue-600 text-white p-2 rounded">
          {isSignup ? "Sign Up" : "Login"}
        </button>
        <p className="mt-2 cursor-pointer text-blue-600" onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? "Already have an account? Login" : "New here? Sign Up"}
        </p>
      </form>
    </div>
  );
}
