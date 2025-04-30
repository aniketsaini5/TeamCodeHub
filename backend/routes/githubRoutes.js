const express = require('express');
const axios = require('axios');
const router = express.Router();


// Create a GitHub repository
router.post('/create-repo', async (req, res) => {
    const { repoName, description } = req.body;

    if (!repoName) {
        return res.status(400).json({
            success: false,
            message: 'Repository name is required',
        });
    }

    const headers = {
        Authorization: `token ${process.env.GITHUB_PAT}`,
        Accept: 'application/vnd.github.v3+json',
    };

    try {
        // Create the repository
        const createRepoResponse = await axios.post(
            'https://api.github.com/user/repos',
            {
                name: repoName,
                private: false,
                auto_init: true,
                description: description || 'A collaborative project created with TeamCodeHub',
            },
            { headers }
        );

        const repoUrl = createRepoResponse.data.html_url;
        const codespaceUrl = `https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=${createRepoResponse.data.owner.login}/${repoName}`;

        res.json({
            success: true,
            repoUrl,
            codespaceUrl,
            message: 'Repository created successfully!',
        });
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        console.error(`Error creating repository: ${errorMessage}`);
        res.status(500).json({
            success: false,
            message: `Failed to create repository: ${errorMessage}`,
        });
    }
});

// Check if a repository name is available
router.get('/check-repo/:name', async (req, res) => {
    const repoName = req.params.name;

    if (!repoName) {
        return res.status(400).json({
            error: 'Repository name is required',
        });
    }

    const headers = {
        Authorization: `token ${process.env.GITHUB_PAT}`,
        Accept: 'application/vnd.github.v3+json',
    };

    try {
        // Check if the repository exists
        await axios.get(`https://api.github.com/repos/${process.env.GITHUB_USERNAME}/${repoName}`, { headers });
        // If the request succeeds, the repository exists
        res.json({ available: false });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            // Repository does not exist
            res.json({ available: true });
        } else if (error.response && error.response.status === 403) {
            // Rate limit or permission issue
            console.error('GitHub API rate limit exceeded or invalid token.');
            res.status(403).json({
                error: 'GitHub API rate limit exceeded or invalid token.',
            });
        } else if (error.response && error.response.status === 401) {
            // Unauthorized (invalid token)
            console.error('Invalid GitHub token.');
            res.status(401).json({
                error: 'Invalid GitHub token.',
            });
        } else {
            // Other errors
            console.error(`Error checking repository availability: ${error.message}`);
            res.status(500).json({
                error: 'Error checking repository availability',
            });
        }
    }
});

module.exports = router;