"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import axios from "./utils/axiosConfig"
import socket from "./utils/socket"

// Components
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Notifications from "./components/Notifications"

// Pages
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import Dashboard from "./pages/Dashboard"
import ProjectPage from "./pages/ProjectPage"

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [socketConnected, setSocketConnected] = useState(false)

  // Check if the user is logged in on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await axios.get("/api/auth/status")
        if (res.data.isAuthenticated) {
          // Assign a random color to the user for cursor identification
          setUser({
            ...res.data.user,
            color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
          })
        }
      } catch (err) {
        console.error("Error checking auth status:", err)
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  // Connect to socket when user is authenticated
  useEffect(() => {
    if (user) {
      const token = localStorage.getItem("authToken")
      socket.auth = { token }
      socket.connect()

      socket.on("connect", () => {
        setSocketConnected(true)
        if (window.notifications) {
          window.notifications.success("Connected to server")
        }
      })

      socket.on("disconnect", () => {
        setSocketConnected(false)
        if (window.notifications) {
          window.notifications.error("Disconnected from server")
        }
      })

      socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err)
        if (window.notifications) {
          window.notifications.error("Connection error: " + err.message)
        }
      })

      return () => {
        socket.off("connect")
        socket.off("disconnect")
        socket.off("connect_error")
        socket.disconnect()
      }
    }
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-900 text-white">
        <Notifications />

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
          <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
          <Route
            path="/dashboard"
            element={user ? <Dashboard user={user} setUser={setUser} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/project/:id"
            element={
              user && socketConnected ? (
                <ProjectPage user={user} />
              ) : user ? (
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
                  <p className="text-white">Connecting to server...</p>
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
                <h1 className="text-4xl font-bold text-white mb-4">404</h1>
                <p className="text-gray-400 mb-6">Page not found</p>
                <button onClick={() => window.history.back()} className="px-4 py-2 bg-purple-600 rounded-md text-white">
                  Go Back
                </button>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
