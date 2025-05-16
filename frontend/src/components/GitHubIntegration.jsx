"use client"

import { useState } from "react"
import axios from "../utils/axiosConfig"

const GitHubIntegration = ({ project, activeFile, onSuccess, onError }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [repoStatus, setRepoStatus] = useState({
    exists: !!project?.githubRepoUrl,
    url: project?.githubRepoUrl || "",
  })

  const createRepo = async () => {
    setIsLoading(true)
    try {
      const res = await axios.post("/api/github/create-repo", {
        projectName: project.name,
        description: project.description,
        projectId: project._id,
      })

      setRepoStatus({
        exists: true,
        url: res.data.repoUrl,
      })

      onSuccess && onSuccess("Repository created successfully!")
      return res.data.repoUrl
    } catch (err) {
      console.error("Error creating repo:", err)
      onError && onError(err.response?.data?.message || "Failed to create repository")
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const pushToGitHub = async () => {
    if (!activeFile) return

    setIsLoading(true)
    try {
      // Create repo if it doesn't exist
      let repoUrl = repoStatus.url
      if (!repoStatus.exists) {
        repoUrl = await createRepo()
        if (!repoUrl) return
      }

      // Push the current file to GitHub
      const res = await axios.post("/api/github/push", {
        repoName: project.name.replace(/\s+/g, "-").toLowerCase(),
        filePath: activeFile.name,
        content: activeFile.content,
        commitMessage: `Update ${activeFile.name}`,
      })

      onSuccess && onSuccess(`Successfully pushed ${activeFile.name} to GitHub`)
    } catch (err) {
      console.error("Error pushing to GitHub:", err)
      onError && onError(err.response?.data?.message || "Failed to push to GitHub")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={pushToGitHub}
        disabled={isLoading || !activeFile}
        className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-white text-sm flex items-center gap-1 transition-colors duration-200"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-1"></div>
        ) : (
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        )}
        {repoStatus.exists ? "Push to GitHub" : "Create & Push to GitHub"}
      </button>

      {repoStatus.exists && (
        <a
          href={repoStatus.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 text-sm underline"
        >
          View Repo
        </a>
      )}
    </div>
  )
}

export default GitHubIntegration
