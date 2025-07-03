import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Badge,
  Typography,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ChatList = () => {
  const { currentUser } = useAuth();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get('/api/chat');
        setChats(response.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const getOtherParticipant = (participants) => {
    return participants.find(p => p._id !== currentUser._id);
  };

  const getUnreadCount = (messages) => {
    return messages.filter(m => !m.read && m.sender._id !== currentUser._id).length;
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <List>
      {chats.map(chat => {
        const otherUser = getOtherParticipant(chat.participants);
        const unreadCount = getUnreadCount(chat.messages);
        const lastMessage = chat.messages[chat.messages.length - 1];

        return (
          <ListItem 
            key={chat._id} 
            button 
            onClick={() => navigate(`/chat/${chat._id}`)}
            sx={{ py: 2 }}
          >
            <ListItemAvatar>
              <Badge 
                badgeContent={unreadCount} 
                color="primary"
                invisible={unreadCount === 0}
              >
                <Avatar src={otherUser.avatar} />
              </Badge>
            </ListItemAvatar>
            <ListItemText
              primary={otherUser.name}
              secondary={
                <>
                  <Typography
                    component="span"
                    variant="body2"
                    color={unreadCount > 0 ? 'text.primary' : 'text.secondary'}
                    sx={{ fontWeight: unreadCount > 0 ? 'bold' : 'normal' }}
                  >
                    {lastMessage?.content || 'No messages yet'}
                  </Typography>
                </>
              }
            />
          </ListItem>
        );
      })}
    </List>
  );
};

export default ChatList;