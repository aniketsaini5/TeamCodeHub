import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";
import CreateProjectModal from "../components/CreateProjectModal";

const Dashboard = ({ user, setUser }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [viewMode, setViewMode] = useState("grid");
    const navigate = useNavigate();
    




    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showDropdown && !event.target.closest(".profile-dropdown")) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showDropdown]);

    useEffect(() => {
        let isActive = true; // Flag to track if component is mounted

        return () => {
            isActive = false; // When component unmounts, we'll set this to false
        };
    }, []);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await axios.get("/api/projects");
                setProjects(res.data.projects);
            } catch (err) {
                console.error("Error fetching projects:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleProjectCreated = (newProject) => {
        setProjects([newProject, ...projects]);
        setShowModal(false);
    };

    // Fixed handleLogout function in Dashboard.jsx
    
    const handleLogout = async () => {
      try {
        await axios.post("/api/auth/logout", {}, { withCredentials: true });
        localStorage.clear();
        setUser(null);
        navigate("/", { replace: true }); // 👈 redirect to homepage
      } catch (err) {
        console.error("Logout failed:", err);
      }
    };
      
    // const handleLogout = async () => {
    //     try {
    //       await axios.post("/api/auth/logout", {}, { withCredentials: true });
    //       localStorage.clear();
      
    //       // First set user null, then navigate (smoother + prevents flash of Dashboard)
    //       setUser(null);
    //       navigate("/");
    //     } catch (err) {
    //       console.error("Error logging out:", err);
    //     } finally {
    //       setShowDropdown(false);
    //     }
    //   };
      
    // Filter and sort projects
    const filteredProjects = projects
        .filter(project =>
            project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.techStack.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
            if (sortBy === "name") return a.name.localeCompare(b.name);
            return 0;
        });

    // Stats section data
    const totalProjects = projects.length;
    const totalMembers = projects.reduce((sum, project) => sum + project.teamMembers.length, 0);
    const latestActivity = projects.length > 0 ?
        new Date(Math.max(...projects.map(p => new Date(p.createdAt)))).toLocaleDateString() :
        "No activity";

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white px-4 py-6 sm:px-6 sm:py-8">
            <div className="max-w-7xl mx-auto">
                {/* Header with improved layout */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div className="animate-fadeIn">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                            Welcome, {user?.name || "Developer"} 👋
                        </h1>
                        <p className="text-gray-400">Manage your collaborative coding projects.</p>
                    </div>
                    <div className="flex items-center gap-3 self-end sm:self-auto profile-dropdown">
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 
                                      transition-all duration-300 text-white px-5 py-2 rounded-xl font-semibold 
                                      flex items-center gap-2 shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            New Project
                        </button>

                        {/* Profile Avatar with improved dropdown */}
                        <div className="relative">
                            <div
                                className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 p-0.5 cursor-pointer hover:scale-105 transition-transform duration-300"
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                <img
                                    src={user?.avatar || "/placeholder.svg"}
                                    alt="User Avatar"
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>

                            {/* Enhanced Dropdown Menu */}
                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden
                                              animate-fadeIn origin-top-right z-50">
                                    <div className="p-3 border-b border-gray-700">
                                        <p className="font-medium text-sm">{user?.name || "User"}</p>
                                        <p className="text-gray-400 text-xs truncate">{user?.email || "user@example.com"}</p>
                                    </div>
                                    <div className="p-1">
                                        {/* <button
                                            className="flex items-center gap-2 w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition-colors duration-150"
                                            onClick={() => navigate("/profile")}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                            </svg>
                                            Profile
                                        </button>
                                        <button
                                            className="flex items-center gap-2 w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition-colors duration-150"
                                            onClick={() => navigate("/settings")}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                            </svg>
                                            Settings
                                        </button> */}
                                        <div className="border-t border-gray-700 my-1"></div>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 w-full text-left px-3 py-2 text-red-400 hover:bg-gray-700 rounded-md transition-colors duration-150"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd" />
                                            </svg>
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-fadeIn">
                    <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-700/50">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-500/20 p-3 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-sm text-gray-400">Total Projects</h3>
                                <p className="text-2xl font-bold">{totalProjects}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-700/50">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-500/20 p-3 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-sm text-gray-400">Team Members</h3>
                                <p className="text-2xl font-bold">{totalMembers}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-700/50">
                        <div className="flex items-center gap-3">
                            <div className="bg-purple-500/20 p-3 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-sm text-gray-400">Last Activity</h3>
                                <p className="text-lg font-bold">{latestActivity}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search & Filter Controls */}
                <div className="mb-6 flex flex-col md:flex-row gap-4 animate-fadeIn">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Search projects or tech stack..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 pl-10 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <div className="flex gap-3">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="name">By Name</option>
                        </select>
                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg flex">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`px-3 py-2 flex items-center justify-center ${viewMode === "grid" ? "bg-purple-600 text-white" : "text-gray-400"} rounded-l-lg`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`px-3 py-2 flex items-center justify-center ${viewMode === "list" ? "bg-purple-600 text-white" : "text-gray-400"} rounded-r-lg`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Project Grid with Skeleton Loading */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-gray-800/50 animate-pulse p-6 rounded-2xl shadow-md">
                                <div className="h-6 bg-gray-700 rounded mb-4 w-3/4"></div>
                                <div className="h-4 bg-gray-700 rounded mb-2 w-1/2"></div>
                                <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                                <div className="mt-4 h-3 bg-gray-700 rounded w-1/4"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {filteredProjects.length > 0 ? (
                            viewMode === "grid" ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredProjects.map((project, index) => (
                                        <div
                                            key={project._id}
                                            onClick={() => navigate(`/project/${project._id}`)}
                                            className="bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/70 cursor-pointer p-6 rounded-2xl 
                                                    shadow-lg border border-gray-700/50 transition-all duration-300 hover:shadow-purple-900/20
                                                    hover:scale-105 hover:border-purple-500/30 group animate-fadeIn"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <h2 className="text-xl font-semibold group-hover:text-purple-400 transition-colors">{project.name}</h2>
                                                <span className="text-xs py-1 px-2 bg-purple-900/40 rounded-full text-purple-300">
                                                    {project.techStack.split(',')[0]}
                                                </span>
                                            </div>
                                            <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                                                {project.description || `A ${project.techStack} project`}
                                            </p>
                                            <div className="flex justify-between items-center">
                                                <div className="flex -space-x-2">
                                                    {[...Array(Math.min(3, project.teamMembers.length))].map((_, i) => (
                                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-800 bg-gray-600 flex items-center justify-center text-xs">
                                                            {project.teamMembers[i]?.name?.[0] || "U"}
                                                        </div>
                                                    ))}
                                                    {project.teamMembers.length > 3 && (
                                                        <div className="w-8 h-8 rounded-full border-2 border-gray-800 bg-gray-600 flex items-center justify-center text-xs">
                                                            +{project.teamMembers.length - 3}
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(project.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-700/50">
                                    {filteredProjects.map((project, index) => (
                                        <div
                                            key={project._id}
                                            onClick={() => navigate(`/project/${project._id}`)}
                                            className="bg-gray-800/50 hover:bg-gray-700/70 cursor-pointer p-4 rounded-xl my-2
                                                    transition-all duration-300 border border-gray-700/50 hover:border-purple-500/30
                                                    flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fadeIn"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <div className="flex-grow">
                                                <h2 className="text-lg font-semibold hover:text-purple-400 transition-colors">{project.name}</h2>
                                                <p className="text-gray-400 text-sm mb-1">
                                                    {project.description || `A ${project.techStack} project`}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs py-0.5 px-2 bg-purple-900/40 rounded-full text-purple-300">
                                                        {project.techStack.split(',')[0]}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        Created {new Date(project.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex -space-x-2">
                                                    {[...Array(Math.min(3, project.teamMembers.length))].map((_, i) => (
                                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-800 bg-gray-600 flex items-center justify-center text-xs">
                                                            {project.teamMembers[i]?.name?.[0] || "U"}
                                                        </div>
                                                    ))}
                                                    {project.teamMembers.length > 3 && (
                                                        <div className="w-8 h-8 rounded-full border-2 border-gray-800 bg-gray-600 flex items-center justify-center text-xs">
                                                            +{project.teamMembers.length - 3}
                                                        </div>
                                                    )}
                                                </div>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        ) : (
                            <div className="col-span-full text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700/50 animate-fadeIn">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-gray-400 mb-4">
                                    {searchQuery ? `No projects matching "${searchQuery}"` : "You haven't created any projects yet."}
                                </p>
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 
                                            transition-all duration-300 text-white px-5 py-2 rounded-xl font-medium 
                                            shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 flex items-center gap-2 mx-auto"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    {searchQuery ? "Create New Project" : "Create Your First Project"}
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Create Project Modal */}
                {showModal && (
                    <CreateProjectModal
                        onClose={() => setShowModal(false)}
                        onProjectCreated={handleProjectCreated}
                    />
                )}
            </div>

            {/* Add CSS for animations */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
};

export default Dashboard;