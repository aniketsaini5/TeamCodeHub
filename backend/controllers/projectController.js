const Project = require('../models/Project');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Create a new project
exports.createProject = async (req, res) => {
  try {
    const { name, description, techStack, teamMembers } = req.body

    if (!name || !techStack) {
      return res.status(400).json({ message: "Project name and tech stack are required" })
    }

    // Create initial file based on tech stack
    let initialFile = {
      name: "index.js",
      content: '// Start coding here\nconsole.log("Hello, TeamCode Hub!");',
      language: "javascript",
    }

    if (techStack.toLowerCase().includes("python")) {
      initialFile = {
        name: "main.py",
        content: '# Start coding here\nprint("Hello, TeamCode Hub!")',
        language: "python",
      }
    } else if (techStack.toLowerCase().includes("c++") || techStack.toLowerCase().includes("c/c++")) {
      initialFile = {
        name: "main.cpp",
        content:
          '#include <iostream>\n\nint main() {\n    std::cout << "Hello, TeamCode Hub!" << std::endl;\n    return 0;\n}',
        language: "cpp",
      }
    } else if (techStack.toLowerCase().includes("java")) {
      initialFile = {
        name: "Main.java",
        content:
          'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, TeamCode Hub!");\n    }\n}',
        language: "java",
      }
    }

    // Filter out empty email entries
    const validTeamMembers = teamMembers
      ? teamMembers.filter((member) => member.email && member.email.trim() !== "")
      : []

    const project = new Project({
      name,
      description,
      techStack,
      teamMembers: [], // We'll add team members after sending invitations
      createdBy: req.user._id,
      files: [initialFile],
      invitationTokens: [],
    })

    // Save the project first to get an ID
    await project.save()

    // Send invitations to team members if there are any
    let invitationResults = null
    if (validTeamMembers.length > 0) {
      invitationResults = await inviteController.sendMultipleInvitations(project._id, validTeamMembers, name)

      // Add team members to the project
      project.teamMembers = validTeamMembers
      await project.save()
    }

    res.status(201).json({
      success: true,
      project,
      invitations: invitationResults,
    })
  } catch (err) {
    console.error("Error creating project:", err)
    res.status(500).json({ message: "Server error", error: err.message })
  }
}


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
    const { code, language, input } = req.body;
    
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

    // Write input to a file if provided
    const inputFile = path.join(tempDir, 'input.txt');
    if (input) {
      fs.writeFileSync(inputFile, input);
    }
    
    // Execute code with input redirection if available
    const execCommand = input 
      ? `cd ${tempDir} && ${command} ${fileName} < input.txt`
      : `cd ${tempDir} && ${command} ${fileName}`;

    exec(execCommand, (error, stdout, stderr) => {
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