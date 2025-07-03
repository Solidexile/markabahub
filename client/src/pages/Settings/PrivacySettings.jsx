import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import {
  Container,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';

const PrivacySettings = () => {
  const { currentUser } = useAuth();
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    friendListVisibility: 'public'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser?.privacy) {
      setPrivacy(currentUser.privacy);
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setPrivacy({
      ...privacy,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await axios.put('/api/users/me/privacy', privacy);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating privacy settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Privacy Settings
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Privacy settings updated successfully!
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit}>
        <FormControl component="fieldset" sx={{ mb: 3 }}>
          <FormLabel component="legend">Profile Visibility</FormLabel>
          <RadioGroup
            name="profileVisibility"
            value={privacy.profileVisibility}
            onChange={handleChange}
          >
            <FormControlLabel
              value="public"
              control={<Radio />}
              label="Public (Anyone can see your profile)"
            />
            <FormControlLabel
              value="friends"
              control={<Radio />}
              label="Friends (Only friends can see your profile)"
            />
            <FormControlLabel
              value="private"
              control={<Radio />}
              label="Private (Only you can see your profile)"
            />
          </RadioGroup>
        </FormControl>
        
        <FormControl component="fieldset" sx={{ mb: 3 }}>
          <FormLabel component="legend">Friend List Visibility</FormLabel>
          <RadioGroup
            name="friendListVisibility"
            value={privacy.friendListVisibility}
            onChange={handleChange}
          >
            <FormControlLabel
              value="public"
              control={<Radio />}
              label="Public (Anyone can see your friends list)"
            />
            <FormControlLabel
              value="friends"
              control={<Radio />}
              label="Friends (Only friends can see your friends list)"
            />
            <FormControlLabel
              value="private"
              control={<Radio />}
              label="Private (Only you can see your friends list)"
            />
          </RadioGroup>
        </FormControl>
        
        <Button 
          type="submit" 
          variant="contained" 
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Save Changes'}
        </Button>
      </Box>
    </Container>
  );
};

export default PrivacySettings;