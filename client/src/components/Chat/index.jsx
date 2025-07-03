import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { 
  Box, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemText,
  Avatar,
  Typography 
} from '@mui/material';

// Initialize socket connection (move to a separate config file if reused)
const socket = io('http://localhost:5000');

const Chat = ({ currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Handle incoming messages
  useEffect(() => {
    socket.on('newMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off('newMessage');
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (inputMessage.trim()) {
      const newMsg = {
        text: inputMessage,
        user: currentUser.name,
        avatar: currentUser.avatar,
        timestamp: new Date().toLocaleTimeString()
      };
      
      socket.emit('sendMessage', newMsg);
      setInputMessage('');
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '80vh',
      border: '1px solid #ddd',
      borderRadius: 2,
      p: 2 
    }}>
      {/* Message List */}
      <List sx={{ flexGrow: 1, overflow: 'auto' }}>
        {messages.map((msg, i) => (
          <ListItem key={i}>
            <Avatar src={msg.avatar} sx={{ mr: 2 }} />
            <ListItemText
              primary={
                <Typography variant="body1">
                  <strong>{msg.user}</strong> ({msg.timestamp})
                </Typography>
              }
              secondary={msg.text}
            />
          </ListItem>
        ))}
        <div ref={messagesEndRef} />
      </List>

      {/* Message Input */}
      <Box sx={{ display: 'flex', mt: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
        />
        <Button 
          variant="contained" 
          onClick={sendMessage}
          sx={{ ml: 2 }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default Chat;