const Project = require('../models/Project');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Create a new project
exports.createProject = async (req, res) => {
  try {
    const { name, description, techStack, teamMembers } = req.body;
    
    if (!name || !techStack) {
      return res.status(400).json({ message: 'Project name and tech stack are required' });
    }

    const project = new Project({
      name,
      description,
      techStack,
      teamMembers: teamMembers || [],
      createdBy: req.user._id,
      files: [
        {
          name: 'index.js',
          content: '// Start coding here\nconsole.log("Hello, TeamCode Hub!");',
          language: 'javascript'
        }
      ]
    });

    await project.save();
    res.status(201).json({ success: true, project });
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all projects for the authenticated user
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user._id })
      .select('name description techStack teamMembers createdAt')
      .sort({ createdAt: -1 });
    
    res.json({ projects });
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get a single project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json({ project });
  } catch (err) {
    console.error('Error fetching project:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update a project file
exports.updateFile = async (req, res) => {
  try {
    const { projectId, fileName, content } = req.body;
    
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Find the file in the project
    const fileIndex = project.files.findIndex(file => file.name === fileName);
    
    if (fileIndex === -1) {
      // File doesn't exist, create it
      project.files.push({
        name: fileName,
        content,
        language: fileName.split('.').pop() || 'javascript',
        lastUpdated: new Date()
      });
    } else {
      // Update existing file
      project.files[fileIndex].content = content;
      project.files[fileIndex].lastUpdated = new Date();
    }
    
    await project.save();
    res.json({ success: true, message: 'File updated successfully' });
  } catch (err) {
    console.error('Error updating file:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Run code in a temporary environment
exports.runCode = async (req, res) => {
  try {
    const { code, language } = req.body;
    
    // Create a temporary directory
    const tempDir = path.join(os.tmpdir(), `teamcode-${Date.now()}`);
    fs.mkdirSync(tempDir, { recursive: true });
    
    let fileName, command;
    
    switch (language) {
      case 'javascript':
        fileName = 'index.js';
        command = 'node';
        break;
      case 'python':
        fileName = 'main.py';
        command = 'python';
        break;
      case 'java':
        fileName = 'Main.java';
        command = 'javac Main.java && java Main';
        break;
      case 'cpp':
        fileName = 'main.cpp';
        command = 'g++ main.cpp -o main && ./main';
        break;
      default:
        fileName = 'index.js';
        command = 'node';
    }
    
    // Write code to file
    const filePath = path.join(tempDir, fileName);
    fs.writeFileSync(filePath, code);
    
    // Execute code
    exec(`cd ${tempDir} && ${command} ${fileName}`, (error, stdout, stderr) => {
      // Clean up temp directory
      fs.rmSync(tempDir, { recursive: true, force: true });
      
      if (error) {
        return res.json({ output: stderr || error.message, error: true });
      }
      
      res.json({ output: stdout, error: false });
    });
  } catch (err) {
    console.error('Error running code:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};