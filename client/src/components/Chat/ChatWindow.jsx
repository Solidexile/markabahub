import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import {
  Box,
  Avatar,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  CircularProgress
} from '@mui/material';
import { Send } from '@mui/icons-material';

const ChatWindow = ({ chatId }) => {
  const { currentUser } = useAuth();
  const [chat, setChat] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const response = await axios.get(`/api/chat/${chatId}`);
        setChat(response.data);
        
        // Mark messages as read
        await axios.put(`/api/chat/${chatId}/read`);
      } catch (error) {
        console.error('Error fetching chat:', error);
      } finally {
        setLoading(false);
      }
    };

    if (chatId) {
      fetchChat();
    }
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      const response = await axios.post(`/api/chat/${chatId}/message`, {
        content: message
      });

      setChat(prev => ({
        ...prev,
        messages: [...prev.messages, response.data]
      }));

      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getOtherParticipant = () => {
    return chat.participants.find(p => p.id !== currentUser.id);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!chat) {
    return <Typography>Select a chat to start messaging</Typography>;
  }

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      {/* Chat header */}
      <Box sx={{ 
        display: 'flex',
        alignItems: 'center',
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Avatar src={getOtherParticipant()?.avatar} sx={{ mr: 2 }} />
        <Typography variant="h6">
          {getOtherParticipant()?.name}
        </Typography>
      </Box>
      
      {/* Messages */}
      <Box sx={{ 
        flexGrow: 1,
        overflowY: 'auto',
        p: 2
      }}>
        <List>
          {chat.messages?.map((msg, index) => (
            <Box key={index}>
              <ListItem 
                sx={{ 
                  justifyContent: msg.sender?.id === currentUser.id ? 'flex-end' : 'flex-start',
                  px: 0
                }}
              >
                {msg.sender?.id !== currentUser.id && (
                  <ListItemAvatar>
                    <Avatar src={msg.sender?.avatar} />
                  </ListItemAvatar>
                )}
                <ListItemText
                  primary={
                    <Box
                      sx={{
                        bgcolor: msg.sender?.id === currentUser.id ? 'primary.main' : 'grey.300',
                        color: msg.sender?.id === currentUser.id ? 'white' : 'text.primary',
                        p: 1.5,
                        borderRadius: 2,
                        maxWidth: '70%',
                        wordBreak: 'break-word'
                      }}
                    >
                      {msg.content}
                    </Box>
                  }
                  secondary={
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ 
                        display: 'block',
                        textAlign: msg.sender?.id === currentUser.id ? 'right' : 'left'
                      }}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  }
                  sx={{ 
                    ml: msg.sender?.id === currentUser.id ? 0 : 1,
                    mr: msg.sender?.id === currentUser.id ? 1 : 0
                  }}
                />
              </ListItem>
              <div ref={messagesEndRef} />
            </Box>
          ))}
        </List>
      </Box>
      
      {/* Message input */}
      <Box sx={{ 
        p: 2,
        borderTop: '1px solid',
        borderColor: 'divider'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <IconButton 
            color="primary" 
            onClick={handleSendMessage}
            disabled={!message.trim()}
          >
            <Send />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatWindow;