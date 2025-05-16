"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import GitHubIntegration from "./GitHubIntegration"

const ConnectedUsers = ({ users }) => (
  <div className="flex items-center gap-2 px-2">
    {users.map((user) => (
      <div key={user.id} className="flex items-center bg-gray-700 rounded-full px-2 py-1 text-sm" title={user.name}>
        <div className="w-4 h-4 rounded-full mr-1" style={{ backgroundColor: user.color || "#ff00ff" }} />
        <span className="text-gray-300">{user.name}</span>
      </div>
    ))}
  </div>
)

const ProjectHeader = ({
  project,
  activeFile,
  connectedUsers,
  onShare,
  onSave,
  onRun,
  isRunning,
  onToggleChat,
  showChat,
}) => {
  const navigate = useNavigate()
  const [showNotification, setShowNotification] = useState(false)
  const [notification, setNotification] = useState({ message: "", type: "info" })

  const displayNotification = (message, type = "info") => {
    setNotification({ message, type })
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  const handleShare = async () => {
    try {
      await onShare()
      displayNotification("Collaboration link copied to clipboard!", "success")
    } catch (err) {
      displayNotification("Failed to copy link. Please try manually.", "error")
    }
  }

  const handleSave = async () => {
    try {
      await onSave()
      displayNotification("File saved successfully!", "success")
    } catch (err) {
      displayNotification("Failed to save file. Please try again.", "error")
    }
  }

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-4 py-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-white">{project?.name}</h1>
          <div className="hidden md:block">
            <ConnectedUsers users={connectedUsers} />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleShare}
            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-white text-sm flex items-center gap-1 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
            Share
          </button>

          <button
            onClick={handleSave}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm transition-colors duration-200"
            disabled={!activeFile}
          >
            <span className="hidden sm:inline">Save</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:hidden"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h1a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h1v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
            </svg>
          </button>

          <GitHubIntegration
            project={project}
            activeFile={activeFile}
            onSuccess={(msg) => displayNotification(msg, "success")}
            onError={(msg) => displayNotification(msg, "error")}
          />

          <button
            onClick={onRun}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-white text-sm flex items-center gap-1 transition-colors duration-200"
            disabled={!activeFile || isRunning}
          >
            {isRunning ? (
              <>
                <div className="w-3 h-3 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                <span className="hidden sm:inline">Running...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="hidden sm:inline">Run</span>
              </>
            )}
          </button>

          <button
            onClick={onToggleChat}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm flex items-center gap-1 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              />
            </svg>
            <span className="hidden sm:inline">{showChat ? "Hide Chat" : "Show Chat"}</span>
          </button>
        </div>
      </div>

      {/* Mobile Connected Users */}
      <div className="md:hidden mt-2">
        <ConnectedUsers users={connectedUsers} />
      </div>

      {/* Notification */}
      {showNotification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-md shadow-lg text-white ${
            notification.type === "success"
              ? "bg-green-500"
              : notification.type === "error"
                ? "bg-red-500"
                : "bg-blue-500"
          } transition-opacity duration-300`}
        >
          {notification.message}
        </div>
      )}
    </header>
  )
}

export default ProjectHeader
