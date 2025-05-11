import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";

const CreateProject = () => {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [members, setMembers] = useState([{ email: "", role: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...members];
    updatedMembers[index][field] = value;
    setMembers(updatedMembers);
  };

  const addMember = () => {
    setMembers([...members, { email: "", role: "" }]);
  };

  const removeMember = (index) => {
    const updatedMembers = members.filter((_, i) => i !== index);
    setMembers(updatedMembers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!projectName || !techStack) {
      setError("Project name and tech stack are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/projects", {
        name: projectName,
        description,
        techStack,
        teamMembers: members.filter((m) => m.email && m.role),
      });

      if (res.data.success) {
        navigate(`/project/${res.data.project._id}`);
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-gray-400 hover:text-white flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Dashboard
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl p-8">
          <h1 className="text-2xl font-bold mb-6">Create New Project</h1>

          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="projectName"
                className="block text-gray-300 mb-2 font-medium"
              >
                Project Name*
              </label>
              <input
                id="projectName"
                type="text"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-gray-300 mb-2 font-medium"
              >
                Description
              </label>
              <textarea
                id="description"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="mb-6">
              <label
                htmlFor="techStack"
                className="block text-gray-300 mb-2 font-medium"
              >
                Tech Stack*
              </label>
              <select
                id="techStack"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                required
              >
                <option value="">Select a Tech Stack</option>
                <option value="C/C++">C/C++</option>
                <option value="Python with Django">Python with Django</option>
                <option value="JAVA">JAVA</option>
                <option value="HTML/CSS/JS">HTML/CSS/JS</option>
                <option value="MERN">MERN</option>
                <option value="MEAN">MEAN</option>
                <option value=".NET">.NET</option>
              </select>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-gray-300 font-medium">Team Members</label>
                <button
                  type="button"
                  onClick={addMember}
                  className="text-purple-400 hover:text-purple-300 text-sm"
                >
                  + Add Member
                </button>
              </div>

              {members.map((member, index) => (
                <div key={index} className="flex gap-4 mb-2">
                  <input
                    type="email"
                    className="w-1/2 p-3 bg-gray-700 border border-gray-600 rounded-xl text-white"
                    placeholder="Email"
                    value={member.email}
                    onChange={(e) =>
                      handleMemberChange(index, "email", e.target.value)
                    }
                  />
                  <select
                    className="w-1/2 p-3 bg-gray-700 border border-gray-600 rounded-xl text-white"
                    value={member.role}
                    onChange={(e) =>
                      handleMemberChange(index, "role", e.target.value)
                    }
                  >
                    <option value="">Select Role</option>
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="Friend">Friend</option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="Full Stack Developer">
                      Full Stack Developer
                    </option>
                  </select>
                  {members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMember(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-6 py-2 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-medium disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;