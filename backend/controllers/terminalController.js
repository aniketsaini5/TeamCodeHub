const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');
const Project = require('../models/Project');

const executeCommand = async (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) reject(stderr || error.message);
            resolve(stdout);
        });
    });
};

const executePython = async (command, input, fileContent, fileName) => {
    const tempDir = path.join(os.tmpdir(), `terminal-${Date.now()}`);
    fs.mkdirSync(tempDir, { recursive: true });

    // Write the file content to temp directory
    const filePath = path.join(tempDir, fileName);
    fs.writeFileSync(filePath, fileContent);

    if (input) {
        fs.writeFileSync(path.join(tempDir, 'input.txt'), input);
    }

    return new Promise((resolve, reject) => {
        const cmd = input 
            ? `python ${fileName} < input.txt`
            : `python ${fileName}`;
        
        exec(cmd, { cwd: tempDir }, (error, stdout, stderr) => {
            fs.rmSync(tempDir, { recursive: true, force: true });
            if (error) reject(stderr || error.message);
            resolve(stdout);
        });
    });
};

const executeCpp = async (command, input, fileContent, fileName) => {
    const tempDir = path.join(os.tmpdir(), `terminal-${Date.now()}`);
    fs.mkdirSync(tempDir, { recursive: true });

    // Write the file content to temp directory
    const filePath = path.join(tempDir, fileName);
    fs.writeFileSync(filePath, fileContent);

    if (input) {
        fs.writeFileSync(path.join(tempDir, 'input.txt'), input);
    }

    return new Promise((resolve, reject) => {
        const isWindows = process.platform === 'win32';
        const outputName = path.parse(fileName).name; // Get filename without extension
        const exeName = isWindows ? `${outputName}.exe` : outputName;
        
        // Compile command with proper quoting
        const compileCmd = `g++ "${fileName}" -o "${exeName}"`;
        
        // Run command with proper Windows/Unix handling
        const runCmd = isWindows 
            ? input 
                ? `cmd.exe /c "${exeName}" < input.txt` 
                : `cmd.exe /c "${exeName}"`
            : input 
                ? `./${exeName} < input.txt` 
                : `./${exeName}`;

        // First compile
        exec(compileCmd, { cwd: tempDir }, (compileError, compileStdout, compileStderr) => {
            if (compileError) {
                fs.rmSync(tempDir, { recursive: true, force: true });
                return reject(compileStderr || compileError.message);
            }
            
            // Then run if compilation succeeded
            exec(runCmd, { cwd: tempDir }, (runError, runStdout, runStderr) => {
                fs.rmSync(tempDir, { recursive: true, force: true });
                if (runError) {
                    reject(runStderr || runError.message);
                } else {
                    resolve(runStdout);
                }
            });
        });
    });
};

const executeJava = async (command, input, fileContent, fileName) => {
    const tempDir = path.join(os.tmpdir(), `terminal-${Date.now()}`);
    fs.mkdirSync(tempDir, { recursive: true });

    // Write the file content to temp directory
    const filePath = path.join(tempDir, fileName);
    fs.writeFileSync(filePath, fileContent);

    if (input) {
        fs.writeFileSync(path.join(tempDir, 'input.txt'), input);
    }

    return new Promise((resolve, reject) => {
        const className = path.basename(fileName, '.java');
        const compileCmd = `javac ${fileName}`;
        const runCmd = input 
            ? `java ${className} < input.txt`
            : `java ${className}`;

        exec(compileCmd, { cwd: tempDir }, (compileError, compileStdout, compileStderr) => {
            if (compileError) {
                fs.rmSync(tempDir, { recursive: true, force: true });
                return reject(compileStderr || compileError.message);
            }
            
            exec(runCmd, { cwd: tempDir }, (runError, runStdout, runStderr) => {
                fs.rmSync(tempDir, { recursive: true, force: true });
                if (runError) {
                    reject(runStderr || runError.message);
                } else {
                    resolve(runStdout);
                }
            });
        });
    });
};

exports.executeTerminalCommand = async (req, res) => {
    const { command, language, projectId, currentFile, input } = req.body;

    try {
        // Get the project and file content
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const file = project.files.find(f => f.name === currentFile);
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        let output;
        switch (language) {
            case 'python':
                output = await executePython(command, input, file.content, file.name);
                break;
            case 'cpp':
                output = await executeCpp(command, input, file.content, file.name);
                break;
            case 'java':
                output = await executeJava(command, input, file.content, file.name);
                break;
            default:
                output = await executeCommand(command);
        }

        res.json({ output });
    } catch (error) {
        res.status(500).json({ 
            error: error.message || 'Execution failed',
            details: error.stderr || error.stdout || 'No additional details available'
        });
    }
};