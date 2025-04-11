import { FcGoogle } from 'react-icons/fc'; // Import the Google icon
import { signInWithGoogle } from "../services/firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const doAuthLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate("/home"); // Navigate to home page after successful login
    } catch (error) {
      console.error('Google sign-in failed', error);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-6 shadow rounded bg-white">
        <h2 className="text-xl font-bold mb-4">Sign in to Your Account</h2>
        <button 
          className="flex items-center space-x-2 border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 transition duration-150" 
          onClick={doAuthLogin}
          disabled={loading}
        >
          <FcGoogle size={24} />
          <span>{loading ? "Signing in..." : "Sign in with Google"}</span>
        </button>
      </div>
    </div>
  );
};

export default AuthLogin;