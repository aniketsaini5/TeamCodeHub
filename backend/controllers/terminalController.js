const executePython = async (command, input, currentFile) => {
    const tempDir = path.join(os.tmpdir(), `terminal-${Date.now()}`);
    fs.mkdirSync(tempDir, { recursive: true });

    // Copy the current file to temp directory
    fs.copyFileSync(currentFile, path.join(tempDir, path.basename(currentFile)));

    if (input) {
        fs.writeFileSync(path.join(tempDir, 'input.txt'), input);
    }

    return new Promise((resolve, reject) => {
        const cmd = input 
            ? `cd ${tempDir} && python ${path.basename(currentFile)} < input.txt`
            : `cd ${tempDir} && python ${path.basename(currentFile)}`;
        
        exec(cmd, (error, stdout, stderr) => {
            fs.rmSync(tempDir, { recursive: true, force: true });
            if (error) reject(stderr || error.message);
            resolve(stdout);
        });
    });
};

const executeCpp = async (command, input, currentFile) => {
    const tempDir = path.join(os.tmpdir(), `terminal-${Date.now()}`);
    fs.mkdirSync(tempDir, { recursive: true });

    // Copy the current file to temp directory
    fs.copyFileSync(currentFile, path.join(tempDir, path.basename(currentFile)));

    if (input) {
        fs.writeFileSync(path.join(tempDir, 'input.txt'), input);
    }

    return new Promise((resolve, reject) => {
        // For Windows, use different commands
        const compileCmd = process.platform === 'win32' 
            ? `cd ${tempDir} && g++ ${path.basename(currentFile)} -o program.exe`
            : `cd ${tempDir} && g++ ${path.basename(currentFile)} -o program`;
        
        const runCmd = process.platform === 'win32'
            ? input ? `program.exe < input.txt` : `program.exe`
            : input ? `./program < input.txt` : `./program`;

        exec(`${compileCmd} && ${runCmd}`, { cwd: tempDir }, (error, stdout, stderr) => {
            fs.rmSync(tempDir, { recursive: true, force: true });
            if (error) reject(stderr || error.message);
            resolve(stdout);
        });
    });
};

const executeJava = async (command, input, currentFile) => {
    const tempDir = path.join(os.tmpdir(), `terminal-${Date.now()}`);
    fs.mkdirSync(tempDir, { recursive: true });

    // Copy the current file to temp directory
    fs.copyFileSync(currentFile, path.join(tempDir, path.basename(currentFile)));

    if (input) {
        fs.writeFileSync(path.join(tempDir, 'input.txt'), input);
    }

    return new Promise((resolve, reject) => {
        const className = path.basename(currentFile, '.java');
        const compileCmd = `cd ${tempDir} && javac ${path.basename(currentFile)}`;
        const runCmd = input 
            ? `cd ${tempDir} && java ${className} < input.txt`
            : `cd ${tempDir} && java ${className}`;

        exec(`${compileCmd} && ${runCmd}`, (error, stdout, stderr) => {
            fs.rmSync(tempDir, { recursive: true, force: true });
            if (error) reject(stderr || error.message);
            resolve(stdout);
        });
    });
};

// Update the main execution function
exports.executeTerminalCommand = async (req, res) => {
    const { command, language, projectId, currentFile, input } = req.body;

    try {
        let output;
        switch (language) {
            case 'python':
                output = await executePython(command, input, currentFile);
                break;
            case 'cpp':
                output = await executeCpp(command, input, currentFile);
                break;
            case 'java':
                output = await executeJava(command, input, currentFile);
                break;
            default:
                output = await executeCommand(command);
        }

        res.json({ output });
    } catch (error) {
        res.status(500).json({ 
            error: error.message,
            details: error.stderr || error.stdout || 'No additional details available'
        });
    }
};