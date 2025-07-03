// server.js
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('sendMessage', (msg) => {
    io.emit('newMessage', msg); // Broadcast to all
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});