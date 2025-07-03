import { Avatar, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotificationItem = ({ notification }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate based on notification type
    switch (notification.type) {
      case 'like':
      case 'comment':
      case 'post_share':
        navigate(`/post/${notification.relatedItem}`);
        break;
      case 'friend_request':
        navigate('/friends/requests');
        break;
      case 'message':
        navigate(`/chat/${notification.relatedItem}`);
        break;
      default:
        navigate(`/profile/${notification.sender.username}`);
    }
  };

  return (
    <ListItem 
      button 
      onClick={handleClick}
      sx={{
        bgcolor: notification.read ? 'background.paper' : 'action.selected',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      <ListItemAvatar>
        <Avatar src={notification.sender.avatar} />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography 
            sx={{ 
              fontWeight: notification.read ? 'normal' : 'bold',
              color: notification.read ? 'text.primary' : 'primary.main'
            }}
          >
            {notification.content}
          </Typography>
        }
        secondary={
          <Typography variant="body2" color="text.secondary">
            {new Date(notification.createdAt).toLocaleString()}
          </Typography>
        }
      />
    </ListItem>
  );
};

export default NotificationItem;