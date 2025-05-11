import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "./utils/axiosConfig";
import socket from "./utils/socket";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ProjectPage from "./pages/ProjectPage";
import CreateProject from "./pages/CreateProject";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if the user is logged in on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await axios.get("/api/auth/status");
        if (res.data.isAuthenticated) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.error("Error checking auth status:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Connect to socket when user is authenticated
  useEffect(() => {
    if (user) {
      socket.connect();
      
      return () => {
        socket.disconnect();
      };
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-900 text-white">
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <>
                  <Navbar />
                  <HomePage />
                  <Footer />
                </>
              )
            }
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
          />
          <Route
            path="/dashboard"
            element={user ? <Dashboard user={user} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/project/:id"
            element={user ? <ProjectPage user={user} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/create-project"
            element={user ? <CreateProject user={user} /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;