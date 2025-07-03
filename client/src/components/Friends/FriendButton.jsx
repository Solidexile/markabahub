import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, CircularProgress, Menu, MenuItem } from '@mui/material';
import { PersonAdd, Check, PersonRemove, Block } from '@mui/icons-material';

const FriendButton = ({ userId }) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const fetchFriendStatus = async () => {
      try {
        const response = await axios.get(`/api/friends/status/${userId}`);
        setStatus(response.data.status);
      } catch (error) {
        console.error('Error fetching friend status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriendStatus();
  }, [userId]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSendRequest = async () => {
    try {
      setLoading(true);
      await axios.post('/api/friends/request', { recipientId: userId });
      setStatus('pending');
    } catch (error) {
      console.error('Error sending friend request:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFriend = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/friends/${userId}`);
      setStatus('none');
      handleMenuClose();
    } catch (error) {
      console.error('Error removing friend:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress size={24} />;
  }

  switch (status) {
    case 'none':
      return (
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={handleSendRequest}
        >
          Add Friend
        </Button>
      );
    case 'pending':
      return (
        <Button
          variant="outlined"
          startIcon={<Check />}
          disabled
        >
          Request Sent
        </Button>
      );
    case 'accepted':
      return (
        <>
          <Button
            variant="contained"
            startIcon={<Check />}
            onClick={handleMenuOpen}
          >
            Friends
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleRemoveFriend}>
              <PersonRemove sx={{ mr: 1 }} /> Unfriend
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Block sx={{ mr: 1 }} /> Block
            </MenuItem>
          </Menu>
        </>
      );
    default:
      return null;
  }
};

export default FriendButton;