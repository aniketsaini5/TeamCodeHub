import { useState, useEffect, useRef } from 'react';
import axios from '../utils/axiosConfig';
import socket from '../utils/socket';

const ChatPanel = ({ projectId, user, className }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Fetch previous messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/chat/messages/${projectId}`);
        setMessages(res.data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [projectId]);

  // Listen for new messages
  useEffect(() => {
    const handler = (msg) => {
      if (msg.projectId === projectId) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on('chat message', handler);
    return () => socket.off('chat message', handler);
  }, [projectId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    const newMessage = {
      content: message,
      sender: {
        id: user.id,
        username: user.username || user.name,
        avatarUrl: user.avatar || user.avatarUrl,
      },
      projectId,
      createdAt: new Date().toISOString(),
    };
    socket.emit('chat message', newMessage);
    setMessage('');
  };

  return (
    <div className={`flex flex-col bg-gray-800 ${className}`}>
      <div className="p-3 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">Team Chat</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} className="mb-4">
              <div className="flex items-start">
                {msg.sender.avatarUrl ? (
                  <img
                    src={msg.sender.avatarUrl}
                    alt={msg.sender.username}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center mr-2">
                    {msg.sender.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="flex items-baseline">
                    <span className="font-semibold text-white">{msg.sender.username}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-gray-300 mt-1">{msg.content}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No messages yet. Start the conversation!</p>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="p-3 border-t border-gray-700">
        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-700 border border-gray-600 rounded-l-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-r-md"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatPanel;