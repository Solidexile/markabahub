import { useState, useEffect } from 'react';
import axios from 'axios';

const useStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStories = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/stories');
      setStories(response.data);
    } catch (error) {
      console.error('Error fetching stories:', error);
      setError('Failed to fetch stories');
    } finally {
      setLoading(false);
    }
  };

  const createStory = async (storyData) => {
    try {
      const response = await axios.post('/api/stories', storyData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('markabaHubToken')}`
        }
      });
      setStories(prev => [response.data, ...prev]);
      return response.data;
    } catch (error) {
      console.error('Error creating story:', error);
      throw error;
    }
  };

  const deleteStory = async (storyId) => {
    try {
      await axios.delete(`/api/stories/${storyId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('markabaHubToken')}`
        }
      });
      setStories(prev => prev.filter(story => story.id !== storyId));
    } catch (error) {
      console.error('Error deleting story:', error);
      throw error;
    }
  };

  const viewStory = async (storyId) => {
    try {
      await axios.put(`/api/stories/${storyId}/view`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('markabaHubToken')}`
        }
      });
    } catch (error) {
      console.error('Error viewing story:', error);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return {
    stories,
    loading,
    error,
    fetchStories,
    createStory,
    deleteStory,
    viewStory
  };
};

export default useStories;
