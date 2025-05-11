import { useState } from 'react';
import axios from '../utils/axiosConfig';

const CreateProjectModal = ({ onClose, onProjectCreated }) => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState([{ email: '', role: '' }]);
  const [techStack, setTechStack] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...members];
    updatedMembers[index][field] = value;
    setMembers(updatedMembers);
  };

  const addMember = () => {
    setMembers([...members, { email: '', role: '' }]);
  };

  const removeMember = (index) => {
    const updatedMembers = members.filter((_, i) => i !== index);
    setMembers(updatedMembers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!projectName || !techStack) {
      setError('Project name and tech stack are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/projects', {
        name: projectName,
        description,
        techStack,
        teamMembers: members.filter(m => m.email && m.role),
      });

      if (res.data.success) {
        onProjectCreated(res.data.project);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Create New Project</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11.93 4.07a1 1 0 0 1 0 1.41L9.41 8l2.52 2.52a1 1 0 1 1-1.41 1.41L8 9.41 5.48 11.93a1 1 0 1 1-1.41-1.41L6.59 8 4.07 5.48a1 1 0 1 1 1.41-1.41L8 6.59l2.52-2.52a1 1 0 0 1 1.41 0z" />
            </svg>
          </button>
        </div>

        {/* Error Message */}
        {error && <div className="text-red-500 mb-4">{error}</div>}

        {/* Project Name */}
        <div className="mb-4">
          <label htmlFor="projectName" className="block text-gray-300 mb-2">Project Name*</label>
          <input
            id="projectName"
            type="text"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-300 mb-2">Description</label>
          <textarea
            id="description"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white"
            rows="2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        {/* Tech Stack */}
        <div className="mb-4">
          <label htmlFor="techStack" className="block text-gray-300 mb-2">Tech Stack*</label>
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

        {/* Team Members */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-white mb-2">Team Members</h3>
          {members.map((member, index) => (
            <div key={index} className="flex gap-4 mb-2">
              <input
                type="email"
                className="w-1/2 p-3 bg-gray-700 border border-gray-600 rounded-xl text-white"
                placeholder="Email"
                value={member.email}
                onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
              />
              <select
                className="w-1/2 p-3 bg-gray-700 border border-gray-600 rounded-xl text-white"
                value={member.role}
                onChange={(e) => handleMemberChange(index, 'role', e.target.value)}
              >
                <option value="">Select Role</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Collaborator">Collaborator</option>
                <option value="Friend">Friend</option>
              </select>
              {members.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMember(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addMember}
            className="text-purple-600 hover:text-purple-700 font-semibold"
          >
            + Add Another Member
          </button>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl"
          >
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;