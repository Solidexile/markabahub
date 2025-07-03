import { useState, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  CircularProgress,
  Box
} from '@mui/material';
import { Close, AddPhotoAlternate, Send } from '@mui/icons-material';

const CreateStoryModal = ({ open, onClose, onStoryCreated }) => {
  const { currentUser } = useAuth();
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(file);
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!media) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('media', media);
      if (caption) formData.append('caption', caption);

      const response = await axios.post('/api/stories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      onStoryCreated(response.data);
      handleClose();
    } catch (error) {
      console.error('Error creating story:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setMedia(null);
    setMediaPreview(null);
    setCaption('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Create New Story
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        {mediaPreview ? (
          <Box sx={{ 
            position: 'relative',
            width: '100%',
            height: 400,
            mb: 2
          }}>
            {media.type.startsWith('image') ? (
              <img
                src={mediaPreview}
                alt="Story preview"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 4
                }}
              />
            ) : (
              <video
                src={mediaPreview}
                controls
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 4
                }}
              />
            )}
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: 400,
              border: '2px dashed',
              borderColor: 'divider',
              borderRadius: 1,
              mb: 2,
              cursor: 'pointer'
            }}
            onClick={() => fileInputRef.current.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,video/*"
              style={{ display: 'none' }}
            />
            <AddPhotoAlternate fontSize="large" color="action" />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              Click to upload photo or video
            </Typography>
          </Box>
        )}
        
        <TextField
          fullWidth
          label="Add a caption (optional)"
          variant="outlined"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          disabled={!media}
        />
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!media || loading}
          startIcon={loading ? <CircularProgress size={20} /> : <Send />}
        >
          Post Story
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateStoryModal;