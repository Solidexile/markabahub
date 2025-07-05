import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import {
  Box,
  Avatar,
  TextField,
  Button,
  IconButton,
  Divider,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import {
  PhotoCamera,
  Videocam,
  LocationOn,
  TagFaces,
  Public,
  People,
  Lock
} from '@mui/icons-material';

const CreatePost = ({ onPostCreated }) => {
  const { currentUser } = useAuth();
  const [content, setContent] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [anchorEl, setAnchorEl] = useState(null);
  const [images, setImages] = useState([]);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handlePrivacyMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePrivacyMenuClose = () => {
    setAnchorEl(null);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setImages([...images, ...imageUrls]);
    setOpenImageDialog(true);
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && images.length === 0) return;
    if (!currentUser) {
      setError('You must be logged in to post');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const postData = {
        content: content.trim(),
        privacy: privacy,
        tags: [],
        location: ''
      };

      const response = await axios.post('/api/posts', postData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('markabaHubToken')}`
        }
      });

      // Clear the form
      setContent('');
      setImages([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Notify parent component about the new post
      if (onPostCreated) {
        onPostCreated(response.data);
      }

      console.log('Post created successfully:', response.data);
    } catch (error) {
      console.error('Error creating post:', error);
      setError(error.response?.data?.message || 'Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ 
      bgcolor: 'background.paper', 
      borderRadius: 1, 
      p: 2, 
      mb: 3,
      boxShadow: 1
    }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar src={currentUser?.avatar} sx={{ mr: 2 }} />
          <TextField
            fullWidth
            placeholder={`What's on your mind, ${currentUser?.name}?`}
            variant="outlined"
            multiline
            rows={2}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
          />
        </Box>
        
        {images.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 1,
              mb: 1
            }}>
              {images.map((img, index) => (
                <Box key={index} sx={{ position: 'relative' }}>
                  <img 
                    src={img} 
                    alt={`Preview ${index}`} 
                    style={{ 
                      width: 100, 
                      height: 100, 
                      objectFit: 'cover',
                      borderRadius: 1
                    }} 
                  />
                  <IconButton
                    size="small"
                    sx={{ 
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.7)'
                      }
                    }}
                    onClick={() => handleRemoveImage(index)}
                  >
                    ×
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
        )}
        
        <Divider sx={{ my: 1 }} />
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="post-images"
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleImageUpload}
              disabled={isSubmitting}
            />
            <label htmlFor="post-images">
              <IconButton component="span" disabled={isSubmitting}>
                <PhotoCamera color="primary" />
              </IconButton>
            </label>
            
            <IconButton disabled>
              <Videocam color="primary" />
            </IconButton>
            
            <IconButton disabled>
              <LocationOn color="primary" />
            </IconButton>
            
            <IconButton disabled>
              <TagFaces color="primary" />
            </IconButton>
          </Box>
          
          <Box>
            <Button
              startIcon={
                privacy === 'public' ? <Public /> :
                privacy === 'friends' ? <People /> :
                <Lock />
              }
              onClick={handlePrivacyMenuOpen}
              disabled={isSubmitting}
              sx={{ mr: 1 }}
            >
              {privacy === 'public' ? 'Public' :
               privacy === 'friends' ? 'Friends' : 'Only me'}
            </Button>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handlePrivacyMenuClose}
            >
              <MenuItem onClick={() => { setPrivacy('public'); handlePrivacyMenuClose(); }}>
                <Public sx={{ mr: 1 }} /> Public
              </MenuItem>
              <MenuItem onClick={() => { setPrivacy('friends'); handlePrivacyMenuClose(); }}>
                <People sx={{ mr: 1 }} /> Friends
              </MenuItem>
              <MenuItem onClick={() => { setPrivacy('private'); handlePrivacyMenuClose(); }}>
                <Lock sx={{ mr: 1 }} /> Only me
              </MenuItem>
            </Menu>
            
            <Button 
              type="submit"
              variant="contained"
              disabled={(!content.trim() && images.length === 0) || isSubmitting}
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CreatePost;