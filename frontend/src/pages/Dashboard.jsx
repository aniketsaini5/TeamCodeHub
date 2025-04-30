import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { MessageCircle, X } from 'lucide-react';

const Dashboard = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [code, setCode] = useState('// Start coding here...\n');

    const openCodespace = () => {
        window.open('https://github.com/codespaces', '_blank');
    };

    const sendMessage = () => {
        if (newMessage.trim()) {
            setMessages([...messages, { text: newMessage, sender: 'You' }]);
            setNewMessage('');
        }
    };

    return (
        <div className="flex h-screen bg-gray-900 text-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 p-4">
                <h2 className="text-xl font-bold mb-6">TeamCode Hub</h2>
                <nav className="space-y-2">
                    <button className="w-full text-left p-2 hover:bg-gray-700 rounded">Home</button>
                    <button className="w-full text-left p-2 hover:bg-gray-700 rounded">My Projects</button>
                    <button className="w-full text-left p-2 hover:bg-gray-700 rounded">Team</button>
                    <button className="w-full text-left p-2 hover:bg-gray-700 rounded">Settings</button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col p-6">
                {/* Projects Table */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Projects</h3>
                    <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="p-3 text-left">Project Name</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Team Roles</th>
                                <th className="p-3 text-left">Permissions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="hover:bg-gray-700">
                                <td className="p-3">Project Alpha</td>
                                <td className="p-3 text-green-400">Active</td>
                                <td className="p-3">Frontend, Backend</td>
                                <td className="p-3">Read, Write</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Code Editor Section */}
                <div className="flex-1 mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">Code Editor</h3>
                        <button
                            onClick={openCodespace}
                            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
                        >
                            Open in Codespaces
                        </button>
                    </div>
                    <div className="h-96 bg-gray-800 rounded-lg overflow-hidden">
                        <Editor
                            height="100%"
                            defaultLanguage="javascript"
                            defaultValue={code}
                            theme="vs-dark"
                            onChange={(value) => setCode(value)}
                        />
                    </div>
                </div>

                {/* Active Team Members */}
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3">Active Team Members</h3>
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Member 1 (Online)</span>
                        </div>
                    </div>
                </div>

                {/* Chat Popup */}
                {isChatOpen && (
                    <div className="fixed bottom-4 right-4 w-80 bg-gray-800 rounded-lg shadow-xl">
                        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                            <h4 className="font-semibold">Team Chat</h4>
                            <button
                                onClick={() => setIsChatOpen(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="h-64 p-4 overflow-y-auto">
                            {messages.map((msg, index) => (
                                <div key={index} className="mb-3">
                                    <span className="text-purple-400">{msg.sender}: </span>
                                    {msg.text}
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-gray-700">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                    className="flex-1 bg-gray-700 rounded px-3 py-2"
                                    placeholder="Type a message..."
                                />
                                <button
                                    onClick={sendMessage}
                                    className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Chat Toggle Button */}
                <button
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className="fixed bottom-4 right-4 bg-purple-600 p-3 rounded-full shadow-lg hover:bg-purple-700"
                >
                    <MessageCircle size={24} />
                </button>
            </div>
        </div>
    );
};

export default Dashboard;