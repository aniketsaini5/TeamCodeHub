import { useState, useEffect } from "react";
import axios from "../utils/axiosConfig";

const LoginPage = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleLogin = () => {
    // Redirect to GitHub OAuth login
    window.location.href = "http://localhost:5000/api/auth/github";
  };

  return (
    <div className="fixed inset-0 bg-black flex justify-center items-center z-50">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg text-center max-w-md w-full mx-4">
        {/* Purple logo */}
        <div>
          <img src="/logo.svg" alt="TeamCode Logo" className="h-16 w-auto mb-6 mx-auto" />
        </div>

        {/* Heading */}
        <h2 className="text-4xl font-bold mb-6 text-purple-500">Welcome to TeamCode Hub</h2>

        {/* Subtitle */}
        <p className="mb-8 text-gray-300 text-lg">
          Collaborate, code, and create amazing projects together
        </p>

        {/* GitHub button */}
        <button
          onClick={handleLogin}
          className="bg-gray-700 hover:bg-purple-800 text-white px-6 py-3 rounded-md flex items-center justify-center w-full mb-6"
        >
          <svg className="mr-2" width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          Continue with GitHub
        </button>

        {/* Terms text */}
        <p className="text-gray-500 text-sm">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default LoginPage;