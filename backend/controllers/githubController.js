// backend/controllers/githubController.js
const axios = require('axios');
const Project = require('../models/Project');
const User = require('../models/User');

// Create GitHub repository for a project
exports.createRepo = async (req, res) => {
  try {
    const { projectName, description, projectId } = req.body;

    if (!projectName) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    const accessToken = req.user.accessToken;
    const repoName = projectName.replace(/\s+/g, "-").toLowerCase();

    // First check if the repo already exists for this user
    try {
      const checkRepoResponse = await axios.get(`https://api.github.com/repos/${req.user.username}/${repoName}`, {
        headers: {
          Authorization: `token ${accessToken}`,
          Accept: 'application/vnd.github+json'
        }
      });

      // If we get here, repo exists already
      const repoUrl = checkRepoResponse.data.html_url;

      // Find and update the project with the repo URL if not already set
      if (projectId) {
        await Project.findByIdAndUpdate(projectId, { githubRepoUrl: repoUrl });
      }

      return res.json({
        success: true,
        message: 'Using existing GitHub repo',
        repoUrl,
        exists: true
      });
    } catch (checkError) {
      // Repo doesn't exist, so create it
      console.log('Repo not found, creating new repository');
    }

    // Create new repository
    const response = await axios.post('https://api.github.com/user/repos', {
      name: repoName,
      description: description || '',
      private: false,
      auto_init: true
    }, {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: 'application/vnd.github+json'
      }
    });

    const repoUrl = response.data.html_url;

    // Update the project with the repo URL
    if (projectId) {
      await Project.findByIdAndUpdate(projectId, { githubRepoUrl: repoUrl });
    }

    res.json({ success: true, message: 'GitHub repo created successfully', repoUrl });
  } catch (err) {
    console.error('Error creating GitHub repo:', err.response?.data || err.message);
    res.status(500).json({
      message: 'Failed to create GitHub repo',
      error: err.response?.data?.message || err.message
    });
  }
};

// Push code to GitHub repository
exports.pushToGitHub = async (req, res) => {
  try {
    const { repoName, filePath, content, commitMessage } = req.body;

    if (!repoName || !filePath || !content) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    const accessToken = req.user.accessToken;
    const normalizedRepoName = repoName.replace(/\s+/g, "-").toLowerCase();

    // First, check if the file exists to get the SHA if it does
    let sha;
    try {
      const fileResponse = await axios.get(
        `https://api.github.com/repos/${req.user.username}/${normalizedRepoName}/contents/${filePath}`,
        {
          headers: {
            Authorization: `token ${accessToken}`,
            Accept: 'application/vnd.github+json'
          }
        }
      );
      sha = fileResponse.data.sha;
    } catch (error) {
      // File doesn't exist yet, which is fine
      console.log('File does not exist yet, creating new file');
    }

    // Now create or update the file
    const response = await axios.put(
      `https://api.github.com/repos/${req.user.username}/${normalizedRepoName}/contents/${filePath}`,
      {
        message: commitMessage || `Update ${filePath}`,
        content: Buffer.from(content).toString('base64'),
        sha: sha
      },
      {
        headers: {
          Authorization: `token ${accessToken}`,
          Accept: 'application/vnd.github+json'
        }
      }
    );

    res.json({
      success: true,
      message: 'Code pushed to GitHub successfully',
      data: response.data
    });
  } catch (err) {
    console.error('Error pushing code to GitHub:', err.response?.data || err.message);
    res.status(500).json({
      message: 'Failed to push code to GitHub',
      error: err.response?.data?.message || err.message
    });
  }
};