import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";
import CreateProjectModal from "../components/CreateProjectModal";

const Dashboard = ({ user }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user?.name || "Developer"} 👋</h1>
            <p className="text-gray-400">Manage your collaborative coding projects.</p>
          </div>
          <div className="flex items-center gap-4">
            {user?.avatar && (
              <img
                src={user.avatar || "/placeholder.svg"}
                alt="User Avatar"
                className="w-10 h-10 rounded-full border border-purple-600"
              />
            )}
            <button
              onClick={() => setShowModal(true)}
              className="bg-purple-600 hover:bg-purple-700 transition text-white px-5 py-2 rounded-xl font-semibold"
            >
              + Create Project
            </button>
          </div>
        </div>

        {/* Project Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length > 0 ? (
              projects.map((project) => (
                <div
                  key={project._id}
                  onClick={() => navigate(`/project/${project._id}`)}
                  className="bg-gray-800 hover:bg-gray-700 cursor-pointer p-6 rounded-2xl shadow-md transition"
                >
                  <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
                  <p className="text-gray-400 text-sm mb-3">
                    Tech: {project.techStack}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Team: {project.teamMembers.length} members
                  </p>
                  <div className="mt-4 text-xs text-gray-500">
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400 mb-4">You haven't created any projects yet.</p>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-purple-600 hover:bg-purple-700 transition text-white px-5 py-2 rounded-xl font-semibold"
                >
                  Create Your First Project
                </button>
              </div>
            )}
          </div>
        )}

        {/* Create Project Modal */}
        {showModal && (
          <CreateProjectModal
            onClose={() => setShowModal(false)}
            onProjectCreated={handleProjectCreated}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;