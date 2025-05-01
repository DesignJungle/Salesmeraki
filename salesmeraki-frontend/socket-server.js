const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Mock user authentication
const authenticateUser = (token) => {
  // In a real app, verify the token
  return true;
};

// Store connected users
const connectedUsers = new Map();

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (authenticateUser(token)) {
    // In a real app, decode the token to get user info
    socket.userId = 'user-' + Math.floor(Math.random() * 1000);
    next();
  } else {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.userId}`);
  connectedUsers.set(socket.userId, socket.id);
  
  // Join user to their personal room
  socket.join(socket.userId);
  
  // Send welcome notification
  socket.emit('notification', {
    id: `welcome-${Date.now()}`,
    type: 'info',
    title: 'Welcome Back',
    message: 'You are now connected to real-time updates',
    timestamp: new Date(),
    read: false,
  });
  
  // Handle chat messages
  socket.on('chat_message', (data) => {
    // In a real app, save the message to database
    
    // Broadcast to all recipients
    if (data.roomId) {
      // Room message
      socket.to(data.roomId).emit('chat_message', {
        ...data,
        senderId: socket.userId,
        timestamp: new Date(),
      });
    } else if (data.recipientId) {
      // Direct message
      const recipientSocketId = connectedUsers.get(data.recipientId);
      if (recipientSocketId) {
        socket.to(recipientSocketId).emit('chat_message', {
          ...data,
          senderId: socket.userId,
          timestamp: new Date(),
        });
      }
    }
  });
  
  // Handle document collaboration
  socket.on('document_update', (data) => {
    // In a real app, save the document update to database
    
    // Broadcast to all collaborators
    socket.to(data.documentId).emit('document_update', {
      ...data,
      userId: socket.userId,
      timestamp: new Date(),
    });
  });
  
  // Join document collaboration room
  socket.on('join_document', (documentId) => {
    socket.join(documentId);
    console.log(`User ${socket.userId} joined document: ${documentId}`);
    
    // Notify other collaborators
    socket.to(documentId).emit('document_user_joined', {
      userId: socket.userId,
      timestamp: new Date(),
    });
  });
  
  // Leave document collaboration room
  socket.on('leave_document', (documentId) => {
    socket.leave(documentId);
    console.log(`User ${socket.userId} left document: ${documentId}`);
    
    // Notify other collaborators
    socket.to(documentId).emit('document_user_left', {
      userId: socket.userId,
      timestamp: new Date(),
    });
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.userId}`);
    connectedUsers.delete(socket.userId);
  });
});

// Demo endpoint to send notifications to all users
app.get('/api/send-notification', (req, res) => {
  const notification = {
    id: `notification-${Date.now()}`,
    type: req.query.type || 'info',
    title: req.query.title || 'New Notification',
    message: req.query.message || 'This is a test notification',
    timestamp: new Date(),
    read: false,
  };
  
  io.emit('notification', notification);
  res.json({ success: true, notification });
});

// Demo endpoint to send notification to specific user
app.get('/api/send-user-notification/:userId', (req, res) => {
  const { userId } = req.params;
  const socketId = connectedUsers.get(userId);
  
  if (!socketId) {
    return res.status(404).json({ success: false, error: 'User not connected' });
  }
  
  const notification = {
    id: `notification-${Date.now()}`,
    type: req.query.type || 'info',
    title: req.query.title || 'New Notification',
    message: req.query.message || 'This is a test notification',
    timestamp: new Date(),
    read: false,
  };
  
  io.to(socketId).emit('notification', notification);
  res.json({ success: true, notification });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});
