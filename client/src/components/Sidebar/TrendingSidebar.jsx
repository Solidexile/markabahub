import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  CircularProgress
} from '@mui/material';
import { Whatshot } from '@mui/icons-material';

const TrendingSidebar = () => {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        const response = await axios.get('/api/feed/trending');
        setTrendingPosts(response.data.data);
      } catch (error) {
        console.error('Error fetching trending posts:', error);
        setTrendingPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingPosts();
  }, []);

  return (
    <Box sx={{ 
      bgcolor: 'background.paper',
      borderRadius: 2,
      p: 2,
      boxShadow: 1
    }}>
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <Whatshot color="primary" sx={{ mr: 1 }} />
        Trending Today
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <List>
          {trendingPosts.map((post, index) => (
            <Box key={post.id}>
              <ListItem alignItems="flex-start" sx={{ py: 1 }}>
                <ListItemAvatar>
                  <Avatar src={post.user?.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography 
                      variant="subtitle2" 
                      sx={{ fontWeight: 'bold' }}
                    >
                      {post.user?.name}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      noWrap
                    >
                      {post.content?.substring(0, 50)}...
                    </Typography>
                  }
                />
              </ListItem>
              {index < trendingPosts.length - 1 && <Divider variant="inset" />}
            </Box>
          ))}
        </List>
      )}
    </Box>
  );
};

export default TrendingSidebar;