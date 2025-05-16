"use client"

import { useState, useEffect } from "react"

const Notification = ({ message, type, onClose, id }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose(id), 300) // Allow time for fade-out animation
    }, 5000)

    return () => clearTimeout(timer)
  }, [id, onClose])

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-500 border-green-600"
      case "error":
        return "bg-red-500 border-red-600"
      case "info":
        return "bg-blue-500 border-blue-600"
      default:
        return "bg-gray-700 border-gray-600"
    }
  }

  return (
    <div
      className={`${getTypeStyles()} border-l-4 p-3 rounded shadow-lg mb-2 transform transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className="flex justify-between items-center">
        <p className="text-white">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(() => onClose(id), 300)
          }}
          className="text-white hover:text-gray-200"
        >
          &times;
        </button>
      </div>
    </div>
  )
}

const Notifications = () => {
  const [notifications, setNotifications] = useState([])

  // Add a notification
  const addNotification = (message, type = "info") => {
    const id = Date.now()
    setNotifications((prev) => [...prev, { id, message, type }])
    return id
  }

  // Remove a notification
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  // Expose methods globally
  useEffect(() => {
    window.notifications = {
      success: (message) => addNotification(message, "success"),
      error: (message) => addNotification(message, "error"),
      info: (message) => addNotification(message, "info"),
      remove: removeNotification,
    }

    return () => {
      delete window.notifications
    }
  }, [])

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 w-72">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          id={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={removeNotification}
        />
      ))}
    </div>
  )
}

export default Notifications
