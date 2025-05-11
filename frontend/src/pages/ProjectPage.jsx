import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";
import socket from "../utils/socket";
import CodeEditor from "../components/CodeEditor";
import ChatPanel from "../components/ChatPanel";
import Terminal from "../components/Terminal";

const ProjectPage = ({ user }) => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [activeFile, setActiveFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChat, setShowChat] = useState(true);
  const [terminalOutput, setTerminalOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`/api/projects/${projectId}`);
        setProject(res.data.project);
        setFiles(res.data.project.files);
        
        if (res.data.project.files.length > 0) {
          setActiveFile(res.data.project.files[0]);
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to load project. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      // Join the project room
      socket.emit("join project", projectId);

      // Listen for code changes
      socket.on("code change", (data) => {
        if (data.userId !== user.id) {
          setFiles((prevFiles) => {
            return prevFiles.map((file) => {
              if (file.name === data.fileName) {
                return { ...file, content: data.content };
              }
              return file;
            });
          });

          if (activeFile && activeFile.name === data.fileName && editorRef.current) {
            // Update the editor value if it's the active file
            editorRef.current.setValue(data.content);
          }
        }
      });

      return () => {
        socket.off("code change");
      };
    }
  }, [projectId, user.id, activeFile]);

  const handleFileSelect = (file) => {
    setActiveFile(file);
  };

  const handleCodeChange = (content) => {
    if (!activeFile) return;

    // Update local state
    setFiles((prevFiles) => {
      return prevFiles.map((file) => {
        if (file.name === activeFile.name) {
          return { ...file, content };
        }
        return file;
      });
    });

    setActiveFile({ ...activeFile, content });

    // Emit code change to other users
    socket.emit("code change", {
      projectId,
      userId: user.id,
      fileName: activeFile.name,
      content,
    });
  };

  const handleSaveFile = async () => {
    if (!activeFile) return;

    try {
      await axios.post("/api/projects/file", {
        projectId,
        fileName: activeFile.name,
        content: activeFile.content,
      });
    } catch (err) {
      console.error("Error saving file:", err);
      setError("Failed to save file. Please try again.");
    }
  };

  const handleCreateFile = async (fileName) => {
    if (!fileName) return;

    // Check if file already exists
    if (files.some((file) => file.name === fileName)) {
      setError(`File ${fileName} already exists.`);
      return;
    }

    const newFile = {
      name: fileName,
      content: "",
      language: fileName.split(".").pop() || "javascript",
    };

    try {
      await axios.post("/api/projects/file", {
        projectId,
        fileName,
        content: "",
      });

      setFiles([...files, newFile]);
      setActiveFile(newFile);
    } catch (err) {
      console.error("Error creating file:", err);
      setError("Failed to create file. Please try again.");
    }
  };

  const handleRunCode = async () => {
    if (!activeFile) return;

    setIsRunning(true);
    setTerminalOutput("Running code...\n");

    try {
      const res = await axios.post("/api/projects/run", {
        code: activeFile.content,
        language: activeFile.language,
      });

      setTerminalOutput(res.data.output || "No output");
    } catch (err) {
      console.error("Error running code:", err);
      setTerminalOutput(`Error: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handlePushToGitHub = async () => {
    if (!project || !activeFile) return;

    try {
      // First check if repo exists, if not create it
      if (!project.githubRepoUrl) {
        const repoRes = await axios.post("/api/github/create-repo", {
          projectName: project.name,
          description: project.description,
        });

        // Update project with repo URL
        setProject({ ...project, githubRepoUrl: repoRes.data.repoUrl });
      }

      // Push the current file to GitHub
      const res = await axios.post("/api/github/push", {
        repoName: project.name.replace(/\s+/g, "-").toLowerCase(),
        filePath: activeFile.name,
        content: activeFile.content,
        commitMessage: `Update ${activeFile.name}`,
      });

      setTerminalOutput(`Successfully pushed to GitHub: ${activeFile.name}`);
    } catch (err) {
      console.error("Error pushing to GitHub:", err);
      setTerminalOutput(`Error pushing to GitHub: ${err.response?.data?.error || err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 px-4">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 bg-purple-600 rounded-md text-white"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-gray-400 hover:text-white mr-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-white">{project?.name}</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSaveFile}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm"
              disabled={!activeFile}
            >
              Save
            </button>
            <button
              onClick={handleRunCode}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-white text-sm"
              disabled={!activeFile || isRunning}
            >
              Run
            </button>
            <button
              onClick={handlePushToGitHub}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-white text-sm"
              disabled={!activeFile}
            >
              Push to GitHub
            </button>
            <button
              onClick={() => setShowChat(!showChat)}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm"
            >
              {showChat ? "Hide Chat" : "Show Chat"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* File Explorer */}
        <div className="w-48 bg-gray-800 border-r border-gray-700 overflow-y-auto">
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-semibold text-gray-400">FILES</h2>
              <button
                onClick={() => {
                  const fileName = prompt("Enter file name:");
                  if (fileName) handleCreateFile(fileName);
                }}
                className="text-gray-400 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <ul className="space-y-1">
              {files.map((file) => (
                <li
                  key={file.name}
                  onClick={() => handleFileSelect(file)}
                  className={`px-2 py-1 rounded text-sm cursor-pointer ${
                    activeFile?.name === file.name
                      ? "bg-gray-700 text-white"
                      : "text-gray-400 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  {file.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Editor and Terminal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeFile ? (
            <CodeEditor
              value={activeFile.content}
              language={activeFile.language}
              onChange={handleCodeChange}
              editorRef={editorRef}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-900 text-gray-500">
              No file selected or create a new file to start coding
            </div>
          )}
          <Terminal output={terminalOutput} />
        </div>

        {/* Chat Panel */}
        {showChat && (
          <ChatPanel
            projectId={projectId}
            user={user}
            className="w-80 border-l border-gray-700"
          />
        )}
      </div>
    </div>
  );
};

export default ProjectPage;