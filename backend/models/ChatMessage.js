const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  sender: { 
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: { type: String, required: true },
    avatarUrl: { type: String }
  },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);