import { FcGoogle } from 'react-icons/fc'; // Import the Google icon
import { signInWithGoogle } from "../services/firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const doAuthLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Starting Google sign-in process...");
      const result = await signInWithGoogle();
      console.log("Sign-in successful:", result);
      navigate("/home"); // Navigate to home page after successful login
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      console.error('Google sign-in failed:', error);
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-6 shadow rounded bg-white">
        <h2 className="text-xl font-bold mb-4">Sign in to Your Account</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
        
        <button 
          className="flex items-center justify-center space-x-2 border border-gray-300 px-4 py-2 rounded w-full hover:bg-gray-100 transition duration-150" 
          onClick={doAuthLogin}
          disabled={loading}
        >
          <FcGoogle size={24} />
          <span className="ml-2">{loading ? "Signing in..." : "Sign in with Google"}</span>
        </button>
      </div>
    </div>
  );
};

export default AuthLogin;