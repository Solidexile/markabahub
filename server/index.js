require('dotenv').config();
const express = require('express');
const sequelize = require('./config/sequelize');
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth');
const marketplaceRoutes = require('./routes/marketplace');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Sync Sequelize models
sequelize.sync()
  .then(() => console.log('MySQL & Sequelize synced!'))
  .catch(err => console.error('Sequelize sync error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/posts', require('./routes/posts'));
app.use('/api/users', require('./routes/users'));
app.use('/api/feed', require('./routes/feed'));

// Socket.io setup
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST']
  }
});

// Socket.io events
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('sendMessage', (message) => {
    io.emit('newMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Make io accessible in routes
app.set('io', io);

// Error handler (should be after all routes)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server + Socket.IO running on http://localhost:${PORT}`);
});