"use client"

import { useState } from "react"

const FileIcon = ({ fileName }) => {
  const extension = fileName.split(".").pop().toLowerCase()

  let iconColor = "text-blue-400"
  const icon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
        clipRule="evenodd"
      />
    </svg>
  )

  switch (extension) {
    case "js":
    case "jsx":
      iconColor = "text-yellow-400"
      break
    case "py":
      iconColor = "text-blue-400"
      break
    case "html":
      iconColor = "text-orange-400"
      break
    case "css":
      iconColor = "text-blue-500"
      break
    case "json":
      iconColor = "text-yellow-300"
      break
    case "cpp":
    case "c":
    case "h":
      iconColor = "text-blue-300"
      break
    case "java":
      iconColor = "text-red-400"
      break
    default:
      iconColor = "text-gray-400"
  }

  return <span className={`mr-2 ${iconColor}`}>{icon}</span>
}

const FileExplorer = ({ files, activeFile, onFileSelect, onCreateFile }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)

  const filteredFiles = searchQuery
    ? files.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : files

  const handleCreateFile = () => {
    const fileName = prompt("Enter file name (with extension):")
    if (fileName) onCreateFile(fileName)
  }

  return (
    <div className="w-48 bg-gray-800 border-r border-gray-700 overflow-y-auto flex flex-col">
      <div className="p-4 flex-shrink-0">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-semibold text-gray-400">FILES</h2>
          <div className="flex items-center">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="text-gray-400 hover:text-white mr-1"
              title="Search files"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button onClick={handleCreateFile} className="text-gray-400 hover:text-white" title="New file">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {showSearch && (
          <div className="mb-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files..."
              className="w-full px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white"
            />
          </div>
        )}
      </div>

      <div className="flex-grow overflow-y-auto">
        <ul className="px-4 space-y-1">
          {filteredFiles.map((file) => (
            <li
              key={file.name}
              onClick={() => onFileSelect(file)}
              className={`px-2 py-1 rounded text-sm cursor-pointer flex items-center ${
                activeFile?.name === file.name
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <FileIcon fileName={file.name} />
              <span className="truncate">{file.name}</span>
            </li>
          ))}

          {filteredFiles.length === 0 && (
            <li className="text-gray-500 text-sm italic px-2 py-1">
              {searchQuery ? "No matching files" : "No files yet"}
            </li>
          )}
        </ul>
      </div>

      <div className="p-4 border-t border-gray-700 flex-shrink-0">
        <button
          onClick={handleCreateFile}
          className="w-full py-1 px-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          New File
        </button>
      </div>
    </div>
  )
}

export default FileExplorer
