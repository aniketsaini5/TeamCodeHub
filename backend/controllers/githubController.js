const axios = require('axios');

// Create GitHub repository for a project
exports.createRepo = async (req, res) => {
  try {
    const { projectName, description } = req.body;
    
    if (!projectName) {
      return res.status(400).json({ message: 'Project name is required' });
    }
    
    const accessToken = req.user.accessToken;
    
    const response = await axios.post('https://api.github.com/user/repos', {
      name: projectName,
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
    
    // First, check if the file exists to get the SHA if it does
    let sha;
    try {
      const fileResponse = await axios.get(
        `https://api.github.com/repos/${req.user.username}/${repoName}/contents/${filePath}`,
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
      `https://api.github.com/repos/${req.user.username}/${repoName}/contents/${filePath}`,
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