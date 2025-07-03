import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  CircularProgress
} from '@mui/material';
import { AddCircle } from '@mui/icons-material';

const Stories = () => {
  const { currentUser } = useAuth();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get('/api/stories');
        setStories(response.data);
      } catch (error) {
        console.error('Error fetching stories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex',
      gap: 2,
      p: 2,
      mb: 3,
      overflowX: 'auto',
      bgcolor: 'background.paper',
      borderRadius: 2,
      boxShadow: 1
    }}>
      {/* Create Story */}
      <Box sx={{ 
        position: 'relative',
        flexShrink: 0,
        width: 100,
        height: 180
      }}>
        <Box
          component="img"
          src={currentUser?.avatar}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 1,
            filter: 'brightness(0.8)'
          }}
        />
        <Box sx={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          p: 1,
          color: 'white'
        }}>
          <IconButton
            color="primary"
            sx={{ 
              backgroundColor: 'primary.main',
              color: 'white',
              mb: 1,
              '&:hover': {
                backgroundColor: 'primary.dark'
              }
            }}
          >
            <AddCircle />
          </IconButton>
          <Typography variant="body2" align="center">
            Create Story
          </Typography>
        </Box>
      </Box>
      
      {/* Friends Stories */}
      {stories.map(story => (
        <Box 
          key={story._id}
          sx={{ 
            position: 'relative',
            flexShrink: 0,
            width: 100,
            height: 180,
            cursor: 'pointer'
          }}
        >
          <Box
            component="img"
            src={story.user.avatar}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 1,
              filter: 'brightness(0.7)'
            }}
          />
          <Box sx={{ 
            position: 'absolute',
            top: 8,
            left: 8,
            border: '2px solid',
            borderColor: 'primary.main',
            borderRadius: '50%'
          }}>
            <Avatar 
              src={story.user.avatar} 
              sx={{ width: 32, height: 32 }} 
            />
          </Box>
          <Box sx={{ 
            position: 'absolute',
            bottom: 8,
            left: 8,
            right: 8,
            color: 'white'
          }}>
            <Typography variant="body2" noWrap>
              {story.user.name}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default Stories;