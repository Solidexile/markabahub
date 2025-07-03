import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import {
  List,
  CircularProgress,
  Typography,
  Button,
  Box
} from '@mui/material';
import NotificationItem from './NotificationItem';

const NotificationList = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/notifications?page=${page}`);
        setNotifications(prev => [...prev, ...response.data]);
        setHasMore(response.data.length > 0);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [page]);

  const markAsRead = async () => {
    try {
      await axios.put('/api/notifications/read');
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Typography variant="h6">Notifications</Typography>
        <Button 
          variant="outlined" 
          size="small"
          onClick={markAsRead}
          disabled={notifications.every(n => n.read)}
        >
          Mark all as read
        </Button>
      </Box>
      
      {notifications.length === 0 && !loading ? (
        <Typography sx={{ p: 2 }}>No notifications yet</Typography>
      ) : (
        <List>
          {notifications.map(notification => (
            <NotificationItem 
              key={notification._id} 
              notification={notification} 
            />
          ))}
        </List>
      )}
      
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
      
      {hasMore && !loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <Button 
            variant="outlined"
            onClick={() => setPage(prev => prev + 1)}
          >
            Load More
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default NotificationList;