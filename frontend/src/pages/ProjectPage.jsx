"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "../utils/axiosConfig"
import socket from "../utils/socket"
import EnhancedCodeEditor from "../components/EnhancedCodeEditor"
import ChatPanel from "../components/ChatPanel"
import Terminal from "../components/Terminal"
import ProjectHeader from "../components/ProjectHeader"
import FileExplorer from "../components/FileExplorer"
import Notifications from "../components/Notifications"

const ProjectPage = ({ user }) => {
  const { id: projectId } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [activeFile, setActiveFile] = useState(null)
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showChat, setShowChat] = useState(true)
  const [terminalOutput, setTerminalOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [connectedUsers, setConnectedUsers] = useState([])
  const [otherCursors, setOtherCursors] = useState({})
  const editorRef = useRef(null)

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`/api/projects/${projectId}`)
        setProject(res.data.project)
        setFiles(res.data.project.files)

        if (res.data.project.files?.length > 0) {
          setActiveFile(res.data.project.files[0])
        }
      } catch (err) {
        console.error("Error fetching project:", err)
        setError("Failed to load project. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [projectId])

  const activeFileRef = useRef(activeFile);
useEffect(() => {
  activeFileRef.current = activeFile;
}, [activeFile]);

  
  // // Socket connection and event handling
  // useEffect(() => {
  //   if (!socket || !projectId) return

  //   // Assign a random color to the user if not already set
  //   const userWithColor = {
  //     ...user,
  //     color: user.color || `#${Math.floor(Math.random() * 16777215).toString(16)}`,
  //   }

  //   socket.emit("join project", {
  //     projectId,
  //     user: {
  //       id: userWithColor.id,
  //       name: userWithColor.name,
  //       color: userWithColor.color,
  //     },
  //   })

  //   socket.on("user joined", (users) => {
  //     setConnectedUsers(users)
  //     // Show notification when a new user joins
  //     if (window.notifications && users.length > connectedUsers.length) {
  //       const newUser = users.find((u) => !connectedUsers.some((cu) => cu.id === u.id))
  //       if (newUser && newUser.id !== user.id) {
  //         window.notifications.info(`${newUser.name} joined the project`)
  //       }
  //     }
  //   })

  //   socket.on("user left", (users) => {
  //     // Find who left
  //     if (window.notifications && users.length < connectedUsers.length) {
  //       const leftUser = connectedUsers.find((u) => !users.some((nu) => nu.id === u.id))
  //       if (leftUser && leftUser.id !== user.id) {
  //         window.notifications.info(`${leftUser.name} left the project`)
  //       }
  //     }
  //     setConnectedUsers(users)
  //     // Remove their cursor
  //     setOtherCursors((prev) => {
  //       const newCursors = { ...prev }
  //       connectedUsers.forEach((u) => {
  //         if (!users.some((nu) => nu.id === u.id)) {
  //           delete newCursors[u.id]
  //         }
  //       })
  //       return newCursors
  //     })
  //   })

  //   socket.on("code change", (data) => {
  //     if (data.userId !== user.id) {
  //       setFiles((prevFiles) =>
  //         prevFiles.map((file) => (file.name === data.fileName ? { ...file, content: data.content } : file)),
  //       )

  //       // Update active file if it's the one being changed
  //       if (activeFile?.name === data.fileName) {
  //         setActiveFile((prev) => ({ ...prev, content: data.content }))
  //       }
  //     }
  //   })

  //   socket.on("cursor move", (data) => {
  //     if (data.userId !== user.id && data.fileName === activeFile?.name) {
  //       setOtherCursors((prev) => ({
  //         ...prev,
  //         [data.userId]: {
  //           position: data.position,
  //           color: data.color,
  //           name: data.name,
  //         },
  //       }))
  //     }
  //   })

  //     // Attach listeners
  // socket.on("user joined", handleUserJoined);
  // socket.on("user left", handleUserLeft);
  // socket.on("code change", handleCodeChange);
  // socket.on("cursor move", handleCursorMove);

  //   return () => {
  //   socket.emit("leave project", projectId);
  //   socket.off("user joined", handleUserJoined);
  //   socket.off("user left", handleUserLeft);
  //   socket.off("code change", handleCodeChange);
  //   socket.off("cursor move", handleCursorMove);
  // };
  //   }, [projectId, user]);
  //   //CHECK KR 
  // // }, [projectId, user, activeFile, connectedUsers])

  useEffect(() => {
  if (!socket || !projectId || !user) return;

  // Assign a random color to the user if not already set
  const userWithColor = {
    ...user,
    color: user.color || `#${Math.floor(Math.random() * 16777215).toString(16)}`,
  };

  socket.emit("join project", {
    projectId,
    user: {
      id: userWithColor.id,
      name: userWithColor.name,
      color: userWithColor.color,
    },
  });

  // Handler functions
  const handleUserJoined = (users) => {
    setConnectedUsers((prev) => {
      // Only show notification if a new user joined
      if (window.notifications && users.length > prev.length) {
        const newUser = users.find((u) => !prev.some((cu) => cu.id === u.id));
        if (newUser && newUser.id !== user.id) {
          // window.notifications.info(`${newUser.name} joined the project`);
        }
      }
      return users;
    });
  };

  const handleUserLeft = (users) => {
    setConnectedUsers((prev) => {
      if (window.notifications && users.length < prev.length) {
        const leftUser = prev.find((u) => !users.some((nu) => nu.id === u.id));
        if (leftUser && leftUser.id !== user.id) {
          // window.notifications.info(`${leftUser.name} left the project`);
        }
      }
      // Remove their cursor
      setOtherCursors((prevCursors) => {
        const newCursors = { ...prevCursors };
        prev.forEach((u) => {
          if (!users.some((nu) => nu.id === u.id)) {
            delete newCursors[u.id];
          }
        });
        return newCursors;
      });
      return users;
    });
  };

 const handleCodeChange = (data) => {
  if (data.userId !== user.id) {
    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.name === data.fileName ? { ...file, content: data.content } : file
      )
    );
    if (activeFile?.name === data.fileName) {
      setActiveFile((prev) => ({ ...prev, content: data.content }));
    }
  }
};

  const handleCursorMove = (data) => {
    if (data.userId !== user.id && data.fileName === activeFile?.name) {
      setOtherCursors((prev) => ({
        ...prev,
        [data.userId]: {
          position: data.position,
          color: data.color,
          name: data.name,
        },
      }));
    }
  };

  // Attach listeners
  socket.on("user joined", handleUserJoined);
  socket.on("user left", handleUserLeft);
  socket.on("code change", handleCodeChange);
  socket.on("cursor move", handleCursorMove);

  // Cleanup
  return () => {
    socket.emit("leave project", projectId);
    socket.off("user joined", handleUserJoined);
    socket.off("user left", handleUserLeft);
    socket.off("code change", handleCodeChange);
    socket.off("cursor move", handleCursorMove);
  };
  // Only depend on projectId and user!
}, [projectId, user,activeFile]);

  // Share functionality
  const handleShare = async () => {
    const shareableLink = `${window.location.origin}/project/${projectId}`

    try {
      await navigator.clipboard.writeText(shareableLink)
      return true
    } catch (err) {
      console.error("Failed to copy link:", err)
      prompt("Copy this collaboration link:", shareableLink)
      throw err
    }
  }

  // File handling functions
  const handleFileSelect = async (file) => {
    if (activeFile?.name === file.name) return

    // Save current file before switching
    if (activeFile) {
      await handleSaveFile()
    }

    setActiveFile(file)
  }

  const handleCodeChange = (content) => {
    if (!activeFile) return

    setFiles((prevFiles) => {
      return prevFiles.map((file) => {
        if (file.name === activeFile.name) {
          return { ...file, content }
        }
        return file
      })
    })

    setActiveFile((prev) => ({ ...prev, content }))

    socket.emit("code change", {
      projectId,
      userId: user.id,
      fileName: activeFile.name,
      content,
    })
  }

  const handleCreateFile = async (fileName) => {
    if (!fileName) return

    if (files.some((file) => file.name === fileName)) {
      setError(`File ${fileName} already exists.`)
      if (window.notifications) {
        window.notifications.error(`File ${fileName} already exists.`)
      }
      return
    }

    const extension = fileName.split(".").pop().toLowerCase()
    let defaultContent = ""
    let language = extension

    switch (extension) {
      case "py":
        defaultContent =
          '# Python code here\n\ndef main():\n    print("Hello World!")\n\nif __name__ == "__main__":\n    main()'
        language = "python"
        break
      case "cpp":
        defaultContent =
          '#include <iostream>\n\nint main() {\n    std::cout << "Hello World!" << std::endl;\n    return 0;\n}'
        language = "cpp"
        break
      case "java":
        defaultContent =
          'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World!");\n    }\n}'
        language = "java"
        break
      default:
        defaultContent = "// Code here"
        language = "javascript"
    }

    const newFile = {
      name: fileName,
      content: defaultContent,
      language,
    }

    try {
      await axios.post("/api/projects/file", {
        projectId,
        fileName,
        content: defaultContent,
      })

      setFiles((prev) => [...prev, newFile])
      setActiveFile(newFile)

      if (window.notifications) {
        window.notifications.success(`File ${fileName} created successfully.`)
      }
    } catch (err) {
      console.error("Error creating file:", err)
      setError("Failed to create file. Please try again.")
      if (window.notifications) {
        window.notifications.error("Failed to create file. Please try again.")
      }
    }
  }

  const handleSaveFile = async () => {
    if (!activeFile) return

    try {
      await axios.post("/api/projects/file", {
        projectId,
        fileName: activeFile.name,
        content: activeFile.content,
      })
      return true
    } catch (err) {
      console.error("Error saving file:", err)
      setError("Failed to save file. Please try again.")
      if (window.notifications) {
        window.notifications.error("Failed to save file. Please try again.")
      }
      throw err
    }
  }

  const handleTerminalCommand = async (command) => {
    try {
      const extension = activeFile?.name.split(".").pop().toLowerCase()
      const res = await axios.post("/api/projects/execute", {
        command,
        projectId,
        language: extension,
        currentFile: activeFile?.name,
        input: command,
      })

      setTerminalOutput((prev) => `${prev}\n$ ${command}\n${res.data.output}`)
    } catch (err) {
      setTerminalOutput((prev) => `${prev}\n$ ${command}\nError: ${err.response?.data?.message || err.message}`)
    }
  }

  const handleRunCode = async () => {
    if (!activeFile) return

    setIsRunning(true)
    setTerminalOutput("Running code...\n")

    try {
      const res = await axios.post("/api/projects/run", {
        code: activeFile.content,
        language: activeFile.language,
        input: "", // Add input if needed
      })

      setTerminalOutput((prev) => `${prev}${res.data.output || "No output"}`)
    } catch (err) {
      console.error("Error running code:", err)
      setTerminalOutput((prev) => `${prev}Error: ${err.response?.data?.error || err.message}`)
    } finally {
      setIsRunning(false)
    }
  }

  // Loading and error states
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 px-4">
        <div className="text-red-500 mb-4">{error}</div>
        <button onClick={() => navigate("/dashboard")} className="px-4 py-2 bg-purple-600 rounded-md text-white">
          Back to Dashboard
        </button>
      </div>
    )
  }

  // Main layout
  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <Notifications />

      <ProjectHeader
        project={project}
        activeFile={activeFile}
        connectedUsers={connectedUsers}
        onShare={handleShare}
        onSave={handleSaveFile}
        onRun={handleRunCode}
        isRunning={isRunning}
        onToggleChat={() => setShowChat(!showChat)}
        showChat={showChat}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <FileExplorer
          files={files}
          activeFile={activeFile}
          onFileSelect={handleFileSelect}
          onCreateFile={handleCreateFile}
        />

        {/* Editor and Terminal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeFile ? (
            <EnhancedCodeEditor
              key={activeFile.name}
              value={activeFile.content}
              language={activeFile.language}
              onChange={handleCodeChange}
              editorRef={editorRef}
              socket={socket}
              projectId={projectId}
              user={user}
              activeFile={activeFile}
              otherCursors={otherCursors}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-900 text-gray-500">
              No file selected or create a new file to start coding
            </div>
          )}
          <Terminal output={terminalOutput} onCommand={handleTerminalCommand} />
        </div>

        {/* Chat Panel */}
        {showChat && <ChatPanel projectId={projectId} user={user} className="w-80 border-l border-gray-700" />}
      </div>
    </div>
  )
}

export default ProjectPage
