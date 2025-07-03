import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  CircularProgress,
  Container,
  Button
} from '@mui/material';
// import FriendList from '../../components/Friends/FriendList';
// import FriendRequestList from '../../components/Friends/FriendRequestList';
// import PeopleYouMayKnow from '../../components/Friends/PeopleYouMayKnow';

const FriendsPage = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState({
    friends: true,
    requests: true,
    suggestions: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch friends
        const friendsRes = await axios.get('/api/friends');
        setFriends(friendsRes.data);
        setLoading(prev => ({ ...prev, friends: false }));
        
        // Fetch friend requests
        const requestsRes = await axios.get('/api/friends/requests');
        setRequests(requestsRes.data);
        setLoading(prev => ({ ...prev, requests: false }));
        
        // Fetch suggestions
        const suggestionsRes = await axios.get('/api/friends/suggestions');
        setSuggestions(suggestionsRes.data);
        setLoading(prev => ({ ...prev, suggestions: false }));
      } catch (error) {
        console.error('Error fetching friends data:', error);
      }
    };

    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  const handleRespondToRequest = async (requestId, action) => {
    try {
      await axios.put(`/api/friends/respond/${requestId}`, { action });
      setRequests(prev => prev.filter(req => req._id !== requestId));
      
      // If accepted, add to friends list
      if (action === 'accept') {
        const request = requests.find(req => req._id === requestId);
        if (request) {
          setFriends(prev => [...prev, request.requester]);
        }
      }
    } catch (error) {
      console.error('Error responding to friend request:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Friends
        </Typography>
        
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ mb: 3 }}
        >
          <Tab label={`All Friends (${friends.length})`} />
          <Tab label={`Requests (${requests.length})`} />
          <Tab label="Suggestions" />
        </Tabs>
        
        {activeTab === 0 && (
          <Box>
            {loading.friends ? (
              <CircularProgress />
            ) : (
              null
            )}
          </Box>
        )}
        
        {activeTab === 1 && (
          <Box>
            {loading.requests ? (
              <CircularProgress />
            ) : requests.length > 0 ? (
              null
            ) : (
              <Typography>No pending friend requests</Typography>
            )}
          </Box>
        )}
        
        {activeTab === 2 && (
          <Box>
            {loading.suggestions ? (
              <CircularProgress />
            ) : (
              null
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default FriendsPage;