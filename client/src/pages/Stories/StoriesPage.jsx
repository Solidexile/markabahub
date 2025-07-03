import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import {
  Box,
  CircularProgress,
  Typography,
  IconButton,
  Avatar
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import StoryViewer from '../../components/Stories/StoryViewer';
import { useNavigate } from 'react-router-dom';

const StoriesPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [storiesData, setStoriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserStories, setSelectedUserStories] = useState(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get('/api/stories');
        setStoriesData(response.data);
      } catch (error) {
        console.error('Error fetching stories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const handleUserClick = (userStories, index) => {
    setSelectedUserStories(userStories);
    setCurrentStoryIndex(index);
  };

  const handleStoryEnd = () => {
    // Find next user with unviewed stories
    const currentUserIndex = storiesData.findIndex(
      user => user.user._id === selectedUserStories.user._id
    );
    
    const nextUser = storiesData.find(
      (user, index) => index > currentUserIndex && user.stories.length > 0
    );
    
    if (nextUser) {
      setSelectedUserStories(nextUser);
      setCurrentStoryIndex(0);
    } else {
      setSelectedUserStories(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (storiesData.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6">No stories available</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          When your friends post stories, they'll appear here.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h5">Stories</Typography>
      </Box>
      
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: 2
      }}>
        {storiesData.map((userStories) => (
          <Box 
            key={userStories.user._id}
            onClick={() => handleUserClick(userStories, 0)}
            sx={{ 
              position: 'relative',
              cursor: 'pointer',
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            <Box
              component="img"
              src={userStories.stories[0].media}
              sx={{
                width: '100%',
                height: 200,
                objectFit: 'cover',
                filter: 'brightness(0.8)'
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
                src={userStories.user.avatar} 
                sx={{ width: 40, height: 40 }} 
              />
            </Box>
            <Box sx={{ 
              position: 'absolute',
              bottom: 8,
              left: 8,
              right: 8,
              color: 'white'
            }}>
              <Typography variant="subtitle2" noWrap>
                {userStories.user.name}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
      
      {selectedUserStories && (
        <StoryViewer
          stories={selectedUserStories.stories}
          open={Boolean(selectedUserStories)}
          onClose={() => setSelectedUserStories(null)}
          onStoryEnd={handleStoryEnd}
        />
      )}
    </Box>
  );
};

export default StoriesPage;