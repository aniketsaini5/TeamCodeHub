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

const FileExplorer = ({ files, activeFile, onFileSelect, onCreateFile, onDeleteFile ,onRenameFile}) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [newFileName, setNewFileName] = useState("")
  const [fileToDelete, setFileToDelete] = useState(null)
  const [fileToRename, setFileToRename] = useState(null)
  const [renameFileName, setRenameFileName] = useState("")

  const filteredFiles = searchQuery
    ? files.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : files

  const handleCreateFile = () => {
    setShowModal(true)
    setNewFileName("")
  }

  const handleModalSubmit = (e) => {
    e.preventDefault()
    if (newFileName.trim()) {
      onCreateFile(newFileName.trim())
      setShowModal(false)
      setNewFileName("")
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
    setNewFileName("")
  }

  const handleDeleteClick = (file) => {
    setFileToDelete(file)
  }

  const confirmDelete = () => {
    if (fileToDelete) {
      onDeleteFile(fileToDelete)
      setFileToDelete(null)
    }
  }

  const cancelDelete = () => {
    setFileToDelete(null)
  }


  // Handler to open rename modal
  const handleRenameClick = (file) => {
    setFileToRename(file)
    setRenameFileName(file.name)
  }

  // Handler to confirm rename
  const confirmRename = (e) => {
    e.preventDefault()
    if (fileToRename && renameFileName.trim() && renameFileName !== fileToRename.name) {
      onRenameFile(fileToRename, renameFileName.trim())
      setFileToRename(null)
      setRenameFileName("")
    }
  }

  // Handler to cancel rename
  const cancelRename = () => {
    setFileToRename(null)
    setRenameFileName("")
  }

  return (
    <div className="w-48 bg-gray-800 border-r border-gray-700 overflow-y-auto flex flex-col">




      {/* Modal for rename file */}
      {fileToRename && (
        <div className="fixed inset-0 flex rounded  items-center justify-center popup-bg z-50">
          <form
            onSubmit={confirmRename}
            className="bg-gray-800 p-6 rounded shadow-lg flex flex-col gap-3 min-w-[300px]"
          >
            <label className="text-white font-semibold mb-1">
              Rename file <span className="text-purple-400">{fileToRename.name}</span> to:
            </label>
            <input
              type="text"
              value={renameFileName}
              onChange={(e) => setRenameFileName(e.target.value)}
              className="px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
              >
                Rename
              </button>
              <button
                type="button"
                onClick={cancelRename}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal for new file */}
      {showModal && (
        <div className="fixed inset-0 flex rounded  items-center justify-center popup-bg z-50">
          <form
            onSubmit={handleModalSubmit}
            className="bg-gray-800 p-6 rounded shadow-lg flex flex-col gap-3 min-w-[300px]"
          >
            <label className="text-white font-semibold mb-1">Enter file name (with extension):</label>
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
              >
                Create
              </button>
              <button
                type="button"
                onClick={handleModalClose}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal for delete confirmation */}
      {fileToDelete && (
        <div className="fixed inset-0 flex  rounded  items-center justify-center popup-bg z-50">
          <div className="bg-gray-800 p-6 rounded shadow-lg flex flex-col gap-3 min-w-[300px]">
            <div className="text-white font-semibold mb-2">
              Delete file <span className="text-red-400">{fileToDelete.name}</span>?
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
              className={`px-2 py-1 rounded text-sm flex items-center justify-between group ${activeFile?.name === file.name
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
                }`}
            >
              <div
                className="flex items-center flex-1 cursor-pointer"
                onClick={() => onFileSelect(file)}
              >
                <FileIcon fileName={file.name} />
                <span className="truncate">{file.name}</span>
              </div>

              <div className="flex items-center">
                <button
                  onClick={() => handleRenameClick(file)}
                  className="ml-2 text-yellow-400 hover:text-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Rename file"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteClick(file)}
                  className="ml-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete file"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
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