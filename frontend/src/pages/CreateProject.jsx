import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from '../utils/axiosConfig';

const CreateProject = () => {
    const navigate = useNavigate();
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [isProjectNameAvailable, setIsProjectNameAvailable] = useState(null);
    const [teamMembers, setTeamMembers] = useState([
        { email: "", role: "frontend_dev" }
    ]);
    const [isCreating, setIsCreating] = useState(false);
    const [result, setResult] = useState({ status: "", message: "" });

    // Check project name availability with debounce
    useEffect(() => {
        if (!projectName.trim()) {
            setIsProjectNameAvailable(null);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                const response = await axiosInstance.get(`/github/check-repo/${projectName}`);
                setIsProjectNameAvailable(response.data.available);
            } catch (error) {
                console.error("Error checking repository name:", error);
                setIsProjectNameAvailable(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [projectName]);

    const handleAddTeamMember = () => {
        setTeamMembers([...teamMembers, { email: "", role: "frontend_dev" }]);
    };

    const handleRemoveTeamMember = (index) => {
        const updatedMembers = [...teamMembers];
        updatedMembers.splice(index, 1);
        setTeamMembers(updatedMembers);
    };

    const handleTeamMemberChange = (index, field, value) => {
        const updatedMembers = [...teamMembers];
        updatedMembers[index][field] = value;
        setTeamMembers(updatedMembers);
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();

        if (!projectName.trim()) {
            setResult({
                status: "error",
                message: "Please enter a project name"
            });
            return;
        }

        if (!isProjectNameAvailable) {
            setResult({
                status: "error",
                message: "Project name is already taken. Please choose another name."
            });
            return;
        }

        setIsCreating(true);
        setResult({ status: "loading", message: "Creating project and setting up environment..." });

        try {
            // Create GitHub repository
            const createRepoResponse = await axiosInstance.post("/github/create-repo", {
                repoName: projectName,
                description: projectDescription
            });

            if (!createRepoResponse.data.success) {
                throw new Error(createRepoResponse.data.message);
            }

            // Get Codespace URL and repository details
            const { repoUrl, codespaceUrl } = createRepoResponse.data;

            // Invite team members (would be implemented in a real backend)
            const invitePromises = teamMembers.map(async (member) => {
                if (!member.email) return null;

                try {
                    // This would be a real API call to invite team members
                    const response = await axiosInstance.post("/invite-team-member", {
                        projectName,
                        email: member.email,
                        role: member.role,
                        codespaceUrl
                    });
                    return response.data;
                } catch (error) {
                    console.error(`Failed to invite ${member.email}:`, error);
                    return { email: member.email, success: false };
                }
            });

            await Promise.all(invitePromises);

            setResult({
                status: "success",
                message: "Project created successfully! Opening Codespace...",
                repoUrl,
                codespaceUrl
            });

            // Automatically open the Codespace after a short delay
            setTimeout(() => {
                window.open(codespaceUrl, "_blank");

                // Navigate to project dashboard in the current window
                navigate(`/project/${projectName}`);
            }, 1500);

        } catch (error) {
            console.error("Error creating project:", error);
            setResult({
                status: "error",
                message: `Failed to create project: ${error.message || "Unknown error"}`
            });
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="max-w-4xl mx-auto p-6">

                <h1 className="text-3xl font-bold mb-6 text-center text-purple-800">Create New Project</h1>
                <form onSubmit={handleCreateProject} className="bg-gray-800 p-6 rounded-lg shadow-md">
                    {/* Project Details Section */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2 text-white">Project Details</h2>

                        <div className="mb-4">
                            <label htmlFor="projectName" className="block text-sm font-medium mb-1 text-gray-300">
                                Project Name
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    id="projectName"
                                    className="w-full p-3 border border-gray-700 rounded-md bg-gray-700 text-white"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value.trim())}
                                    placeholder="Enter Project Name"
                                    pattern="[a-zA-Z0-9-_.]+"
                                    title="Use only letters, numbers, hyphens, underscores, and periods"
                                    required
                                />
                            </div>
                            {projectName && (
                                <div className="mt-1 text-sm">
                                    {isProjectNameAvailable === null ? (
                                        <span className="text-gray-400">Checking availability...</span>
                                    ) : isProjectNameAvailable ? (
                                        <span className="text-green-400">✓ Project name is available</span>
                                    ) : (
                                        <span className="text-red-400">✗ Project name is already taken</span>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="projectDescription" className="block text-sm font-medium mb-1 text-gray-300">
                                Project Description
                            </label>
                            <textarea
                                id="projectDescription"
                                className="w-full p-3 border border-gray-700 rounded-md bg-gray-700 text-white"
                                value={projectDescription}
                                onChange={(e) => setProjectDescription(e.target.value)}
                                placeholder="Describe your project (optional)"
                                rows="3"
                            />
                        </div>
                    </div>

                    {/* Team Members Section */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2 text-white">Team Members</h2>
                        <p className="text-sm text-gray-400 mb-4">
                            Add team members who will collaborate on this project. They will receive an email invitation
                            with access to the online code editor.
                        </p>

                        {teamMembers.map((member, index) => (
                            <div key={index} className="flex gap-3 mb-3">
                                <div className="flex-1">
                                    <input
                                        type="email"
                                        className="w-full p-3 border border-gray-700 rounded-md bg-gray-700 text-white"
                                        value={member.email}
                                        onChange={(e) => handleTeamMemberChange(index, "email", e.target.value)}
                                        placeholder="Email address"
                                    />
                                </div>
                                <div className="w-40">
                                    <select
                                        className="w-full p-3 border border-gray-700 rounded-md bg-gray-700 text-white"
                                        value={member.role}
                                        onChange={(e) => handleTeamMemberChange(index, "role", e.target.value)}
                                    >
                                        <option value="team_leader">Team Leader</option>
                                        <option value="frontend_dev">Frontend Dev</option>
                                        <option value="backend_dev">Backend Dev</option>
                                        <option value="database_dev">Database Dev</option>
                                        <option value="designer">Designer</option>
                                    </select>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTeamMember(index)}
                                    className="p-3 border border-gray-700 rounded-md text-red-400 hover:bg-gray-700"
                                    disabled={teamMembers.length === 1}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={handleAddTeamMember}
                            className="mt-2 flex items-center text-purple-400 hover:text-purple-300"
                        >
                            <span className="mr-1">+</span> Add Another Team Member
                        </button>
                    </div>

                    {/* GitHub Codespaces Integration Notice */}
                    <div className="mb-8 bg-gray-900 p-4 rounded-md border border-gray-700">
                        <h3 className="font-semibold mb-2 text-white">GitHub Codespaces Integration</h3>
                        <p className="text-sm text-gray-400">
                            Your project will be created as a GitHub repository and opened in GitHub Codespaces,
                            providing a full VS Code experience in your browser. Team members will receive a link
                            to join the same workspace.
                        </p>
                    </div>

                    {/* Result Message */}
                    {result.status && (
                        <div className={`mb-6 p-4 rounded-md ${
                            result.status === "success" ? "bg-green-900 text-green-300" :
                            result.status === "error" ? "bg-red-900 text-red-300" :
                            "bg-blue-900 text-blue-300"
                        }`}>
                            {result.status === "loading" && (
                                <div className="flex items-center">
                                    <div className="animate-spin mr-2 h-5 w-5 border-t-2 border-b-2 border-blue-300 rounded-full"></div>
                                    {result.message}
                                </div>
                            )}
                            {result.status !== "loading" && result.message}

                            {result.status === "success" && result.repoUrl && (
                                <div className="mt-3 flex gap-3">
                                    <a
                                        href={result.repoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm underline text-purple-300"
                                    >
                                        View Repository
                                    </a>
                                    <a
                                        href={result.codespaceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm underline text-purple-300"
                                    >
                                        Open in Codespaces
                                    </a>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={isCreating || !isProjectNameAvailable}
                            className={`px-6 py-3 rounded-md text-white font-medium ${
                                isCreating || !isProjectNameAvailable
                                ? "bg-gray-600 cursor-not-allowed"
                                : "bg-purple-600 hover:bg-purple-700"
                            }`}
                        >
                            {isCreating ? "Creating Project..." : "Create Project & Open in Codespaces"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProject;