import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';

const CreateStory = ({ onStoryCreated }) => {
  const { currentUser } = useAuth();
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a media file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('media', file);
      formData.append('caption', caption);

      const response = await axios.post('/api/stories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('markabaHubToken')}`
        }
      });

      if (onStoryCreated) {
        onStoryCreated(response.data);
      }

      // Reset form
      setFile(null);
      setCaption('');
      e.target.reset();
    } catch (error) {
      console.error('Error creating story:', error);
      setError(error.response?.data?.message || 'Failed to create story');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Create Story
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 2 }}>
          <input
            accept="image/*,video/*"
            style={{ display: 'none' }}
            id="story-media"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="story-media">
            <Button
              variant="outlined"
              component="span"
              startIcon={<PhotoCamera />}
              fullWidth
            >
              Select Media
            </Button>
          </label>
          {file && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected: {file.name}
            </Typography>
          )}
        </Box>

        <TextField
          fullWidth
          label="Caption (optional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          multiline
          rows={2}
          sx={{ mb: 2 }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={!file || loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Create Story'}
        </Button>
      </form>
    </Box>
  );
};

export default CreateStory;
