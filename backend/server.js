// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
require('dotenv').config(); // Load environment variables

// Import routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/project');
const githubRoutes = require('./routes/github');
const chatRoutes = require('./routes/chat');
const apiRoutes = require('./routes/api');


const connectedUsers = new Map();

// Initialize Express app
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with CORS configuration
const io = socketIo(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173', // Allow requests from frontend
        methods: ['GET', 'POST'], // Allowed HTTP methods
        credentials: true // Allow cookies and credentials
    }
});

// Middleware configuration
app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true // Allow cookies and credentials
}));
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Session configuration
const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || 'TCH_SECRET', // Secret for signing session cookies
    resave: false, // Do not save session if it hasn't been modified
    saveUninitialized: false, // Do not save uninitialized sessions
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI, // MongoDB connection URI
        ttl: 14 * 24 * 60 * 60 // Session expiration time (14 days)
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        maxAge: 14 * 24 * 60 * 60 * 1000 // Cookie expiration time (14 days)
    }
});

// Apply session middleware
app.use(sessionMiddleware);
app.use(passport.initialize()); // Initialize Passport.js
app.use(passport.session()); // Enable session support for Passport.js

// Convert Express middleware to Socket.IO middleware
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
io.use(wrap(sessionMiddleware)); // Apply session middleware to Socket.IO
io.use(wrap(passport.initialize())); // Apply Passport.js initialization to Socket.IO
io.use(wrap(passport.session())); // Apply Passport.js session support to Socket.IO

// Passport configuration
require('./config/passport')(app);

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // User joins a project room
    socket.on('join project', ({ projectId, user }) => {
        socket.join(projectId);

        if (!connectedUsers.has(projectId)) {
            connectedUsers.set(projectId, new Map());
        }
        connectedUsers.get(projectId).set(socket.id, user);

        // Broadcast updated user list
        const users = Array.from(connectedUsers.get(projectId).values());
        io.to(projectId).emit('user joined', users);
        console.log(`User ${user.name} joined project: ${projectId}`);
    });

    // User leaves a project room
    socket.on('leave project', (projectId) => {
        if (connectedUsers.has(projectId)) {
            const users = connectedUsers.get(projectId);
            users.delete(socket.id);

            if (users.size === 0) {
                connectedUsers.delete(projectId);
            } else {
                io.to(projectId).emit('user left', Array.from(users.values()));
            }
        }
        socket.leave(projectId);
    });

    // Broadcast code changes to other users in the project
    socket.on('code change', (data) => {
        socket.to(data.projectId).emit('code change', data);
    });

    // Broadcast cursor position (optional, for future use)
    socket.on('cursor move', (data) => {
        socket.to(data.projectId).emit('cursor move', data);
    });
////////////////////////////////////////////////////////////////
     socket.on('chat message', (msg) => {
        // Optionally save to DB here
        io.to(msg.projectId).emit('chat message', msg); // Broadcast to all in room
    });

    ////////////////////////////////////////////////////////////////////////////

    // Handle disconnect
    socket.on('disconnect', () => {
        for (const [projectId, users] of connectedUsers.entries()) {
            if (users.has(socket.id)) {
                users.delete(socket.id);
                if (users.size === 0) {
                    connectedUsers.delete(projectId);
                } else {
                    io.to(projectId).emit('user left', Array.from(users.values()));
                }
                break;
            }
        }
        console.log('User disconnected:', socket.id);
    });
});

// Register routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/projects', projectRoutes); // Project-related routes
app.use('/api/github', githubRoutes); // GitHub-related routes
app.use('/api/chat', chatRoutes); // Chat-related routes
app.use('/api', apiRoutes); // General API routes

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));