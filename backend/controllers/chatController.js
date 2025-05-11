const ChatMessage = require('../models/ChatMessage');

// Save a chat message
exports.saveMessage = async (req, res) => {
  try {
    const { content, projectId } = req.body;
    
    if (!content || !projectId) {
      return res.status(400).json({ message: 'Content and projectId are required' });
    }
    
    const message = new ChatMessage({
      content,
      sender: {
        id: req.user._id,
        username: req.user.username,
        avatarUrl: req.user.avatarUrl
      },
      projectId,
    });
    
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    console.error('Error saving message:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Save a message from socket
exports.saveMessageSocket = async (msg) => {
  try {
    const message = new ChatMessage({
      content: msg.content,
      sender: msg.sender,
      projectId: msg.projectId,
    });
    
    await message.save();
    return message;
  } catch (err) {
    console.error('Error saving socket message:', err);
    return null;
  }
};

// Get chat messages for a project
exports.getMessages = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    if (!projectId) {
      return res.status(400).json({ message: 'ProjectId is required' });
    }
    
    const messages = await ChatMessage.find({ projectId })
      .sort({ createdAt: 1 })
      .limit(100);
    
    res.status(200).json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};