const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    techStack: { type: String, required: true },
    teamMembers: [
        {
            email: { type: String, required: true },
            role: {
                type: String,
                enum: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer'],
                required: true
            },
        },
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    githubRepoUrl: { type: String },
    files: [
        {
            name: { type: String, required: true },
            content: { type: String, default: '' },
            language: { type: String, default: 'javascript' },
            lastUpdated: { type: Date, default: Date.now }
        }
    ],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Project', projectSchema);