const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Import modules
const connectDB = require('./config/database');
const configureSession = require('./config/session');
const configurePassport = require('./config/passport');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
const githubRoutes = require('./routes/githubRoutes');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Configure session
configureSession(app);

// Configure passport
configurePassport(app);

// Routes
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/github', githubRoutes); // Use GitHub routes

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});






// require("dotenv").config();
// const express = require("express");
// const axios = require("axios");
// const cors = require("cors");
// const path = require("path");

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors());
// app.use(express.static(path.join(__dirname, "public")));

// // Environment variables
// const GITHUB_USERNAME = "Team-Code-Hub";
// const GITHUB_PAT = "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";

// // Helper function to create README content
// const generateReadmeContent = (repoName) => {
//   return `# ${repoName}\n\nWelcome to ${repoName}! This is a collaborative project created through TeamCodeHub.\n\n## Getting Started\n\n1. Clone the repository\n2. Open in GitHub Codespaces\n3. Start collaborating!\n`;
// };

// // Create repository and initialize with README if empty
// app.post("/create-repo", async (req, res) => {
//   const { repoName } = req.body;

//   if (!repoName) {
//     return res.status(400).json({ 
//       success: false, 
//       message: "Repository name is required" 
//     });
//   }

//   const headers = {
//     "Authorization": `token ${GITHUB_PAT}`,
//     "Accept": "application/vnd.github.v3+json"
//   };

//   try {
//     // Create repository
//     const createRepoResponse = await axios.post(
//       "https://api.github.com/user/repos",
//       {
//         name: repoName,
//         private: false,
//         auto_init: true, // Initialize with README
//         description: `A collaborative project created with TeamCodeHub`
//       },
//       { headers }
//     );

//     const repoUrl = createRepoResponse.data.html_url;
//     const codespaceUrl = `https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=${GITHUB_USERNAME}/${repoName}`;

//     // Check if repo is empty and create README if needed
//     try {
//       await axios.get(`https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/contents`, { headers });
//     } catch (error) {
//       if (error.response && error.response.status === 404) {
//         // Create README.md
//         await axios.put(
//           `https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/contents/README.md`,
//           {
//             message: "Initialize repository with README",
//             content: Buffer.from(generateReadmeContent(repoName)).toString('base64')
//           },
//           { headers }
//         );
//       }
//     }

//     res.json({ 
//       success: true, 
//       repoUrl, 
//       codespaceUrl,
//       message: "Repository created successfully!"
//     });

//   } catch (error) {
//     const errorMessage = error.response?.data?.message || error.message;
//     res.status(500).json({ 
//       success: false, 
//       message: `Failed to create repository: ${errorMessage}`
//     });
//   }
// });

// // Check if repository name is available
// app.get("/check-repo/:name", async (req, res) => {
//   const repoName = req.params.name;

//   try {
//     await axios.get(`https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}`, {
//       headers: {
//         "Authorization": `token ${GITHUB_PAT}`,
//         "Accept": "application/vnd.github.v3+json"
//       }
//     });
//     res.json({ available: false });
//   } catch (error) {
//     if (error.response && error.response.status === 404) {
//       res.json({ available: true });
//     } else {
//       res.status(500).json({ 
//         error: "Error checking repository availability" 
//       });
//     }
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log(`Access the application at http://localhost:${PORT}`);
// });