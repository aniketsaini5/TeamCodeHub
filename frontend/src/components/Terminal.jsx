"use client"

import { useState, useRef, useEffect } from "react"

const Terminal = ({ output, onCommand }) => {
  const [command, setCommand] = useState("")
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [inputValue, setInputValue] = useState("")
  const terminalRef = useRef(null)
  const inputRef = useRef(null)

  // Scroll to bottom when output changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [output])

  // Focus input when terminal is clicked
  const focusInput = () => {
    inputRef.current?.focus()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!command.trim()) return

    // Add to history
    setHistory([...history, command])
    setHistoryIndex(-1)

    // Execute command
    onCommand(command)

    // Clear input
    setCommand("")
  }

  const handleKeyDown = (e) => {
    // Handle up/down arrows for history navigation
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setCommand(history[history.length - 1 - newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setCommand(history[history.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setCommand("")
      }
    }
  }

  return (
    <div
      className="h-48 bg-gray-900 border-t border-gray-700 p-2 font-mono text-sm overflow-auto"
      ref={terminalRef}
      onClick={focusInput}
    >
      <div className="text-gray-400 whitespace-pre-wrap">{output}</div>
      <form onSubmit={handleSubmit} className="flex items-center mt-1">
        <span className="text-green-500 mr-2">$</span>
        <input
          type="text"
          ref={inputRef}
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none text-white"
          placeholder="Enter command..."
          autoFocus
        />
      </form>
    </div>
  )
}

export default Terminal
