"use client"

import { useEffect, useRef, useState } from "react"
import * as monaco from "monaco-editor"
import UserCursors from "./UserCursors"

const EnhancedCodeEditor = ({
  value,
  language,
  onChange,
  editorRef,
  socket,
  projectId,
  user,
  activeFile,
  otherCursors = {},
}) => {
  const containerRef = useRef(null)
  const monacoRef = useRef(null)
  const [decorations, setDecorations] = useState([])
  const [editorMounted, setEditorMounted] = useState(false)
  const [cursorPositions, setCursorPositions] = useState({})

  // Initialize editor
  useEffect(() => {
    if (containerRef.current && !monacoRef.current) {
      monacoRef.current = monaco.editor.create(containerRef.current, {
        value: value || "",
        language: language || "javascript",
        theme: "vs-dark",
        automaticLayout: true,
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        fontSize: 14,
        tabSize: 2,
        lineNumbers: "on",
        renderWhitespace: "selection",
        cursorBlinking: "smooth",
        cursorSmoothCaretAnimation: true,
        bracketPairColorization: { enabled: true },
      })

      // Handle content changes
      const changeDisposable = monacoRef.current.onDidChangeModelContent(() => {
        const newContent = monacoRef.current.getValue()
        onChange(newContent)
      })

      // Handle cursor position changes
      const cursorDisposable = monacoRef.current.onDidChangeCursorPosition((e) => {
        if (socket && projectId && user && activeFile) {
          // Get viewport coordinates for the cursor
          const editorCoords = monacoRef.current.getScrolledVisiblePosition(e.position)
          const editorDomNode = monacoRef.current.getDomNode()

          if (editorCoords && editorDomNode) {
            const cursorPosition = {
              left: editorCoords.left,
              top: editorCoords.top,
              lineNumber: e.position.lineNumber,
              column: e.position.column,
            }

            socket.emit("cursor move", {
              projectId,
              userId: user.id,
              fileName: activeFile.name,
              position: cursorPosition,
              name: user.name,
              color: user.color || `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            })
          }
        }
      })

      if (editorRef) {
        editorRef.current = monacoRef.current
      }

      setEditorMounted(true)

      return () => {
        changeDisposable.dispose()
        cursorDisposable.dispose()
        if (monacoRef.current) {
          monacoRef.current.dispose()
          monacoRef.current = null
        }
      }
    }
  }, [])

  // Handle remote cursors
  useEffect(() => {
    if (!monacoRef.current || !editorMounted) return

    // Convert cursor positions to viewport coordinates
    const updatedPositions = {}
    Object.entries(otherCursors).forEach(([userId, data]) => {
      if (data.position && data.position.lineNumber) {
        const editorCoords = monacoRef.current.getScrolledVisiblePosition({
          lineNumber: data.position.lineNumber,
          column: data.position.column,
        })

        if (editorCoords) {
          updatedPositions[userId] = {
            ...data,
            position: {
              left: editorCoords.left,
              top: editorCoords.top,
            },
          }
        }
      }
    })

    setCursorPositions(updatedPositions)

    // Add decorations for cursor positions
    const newDecorations = Object.entries(otherCursors)
      .filter(([userId]) => userId !== user?.id)
      .map(([userId, data]) => {
        if (!data.position || !data.position.lineNumber) return null

        return {
          range: new monaco.Range(
            data.position.lineNumber,
            data.position.column,
            data.position.lineNumber,
            data.position.column + 1,
          ),
          options: {
            className: `remote-cursor-${userId}`,
            hoverMessage: { value: data.name },
            inlineClassName: `remote-cursor-inline-${userId}`,
            stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
          },
        }
      })
      .filter(Boolean)

    setDecorations((oldDecorations) => {
      return monacoRef.current.deltaDecorations(oldDecorations, newDecorations)
    })

    return () => {
      if (monacoRef.current) {
        monacoRef.current.deltaDecorations(decorations, [])
      }
    }
  }, [otherCursors, user?.id, editorMounted])

  // Update content without losing cursor
  useEffect(() => {
    if (monacoRef.current && value !== monacoRef.current.getValue()) {
      const model = monacoRef.current.getModel()
      const selections = monacoRef.current.getSelections()

      model.pushEditOperations(
        selections,
        [
          {
            range: model.getFullModelRange(),
            text: value,
          },
        ],
        () => selections,
      )
    }
  }, [value])

  // Update language
  useEffect(() => {
    if (monacoRef.current) {
      const model = monacoRef.current.getModel()
      if (model) {
        monaco.editor.setModelLanguage(model, language || "javascript")
      }
    }
  }, [language])

  // Add custom CSS for remote cursors
  useEffect(() => {
    const style = document.createElement("style")
    document.head.appendChild(style)

    Object.entries(otherCursors).forEach(([userId, data]) => {
      const color = data.color || "#ff00ff"
      style.sheet.insertRule(
        `
        .remote-cursor-inline-${userId} {
          background-color: ${color}40;
          border-left: 2px solid ${color};
        }
      `,
        0,
      )
    })

    return () => {
      document.head.removeChild(style)
    }
  }, [otherCursors])

  return (
    <div className="relative flex-1 min-h-0">
      <div ref={containerRef} className="absolute inset-0" />
      <UserCursors cursors={cursorPositions} />
    </div>
  )
}

export default EnhancedCodeEditor
