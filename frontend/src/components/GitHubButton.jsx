// frontend/src/components/GitHubButton.jsx
import React from 'react';
import axios from 'axios';

const GitHubButton = ({ repoName, filePath, content, commitMessage }) => {
    const handlePushToGitHub = async () => {
        try {
            const response = await axios.post('/api/github/push', {
                repoName,
                filePath,
                content,
                commitMessage,
            });

            alert(response.data.message);
        } catch (err) {
            console.error(err);
            alert(`Failed to push code to GitHub: ${err.response?.data?.error || err.message}`);
        }
    };

    return (
        <button onClick={handlePushToGitHub}>
            Save to GitHub
        </button>
    );
};

export default GitHubButton;
