import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Avatar, 
  Grid, 
  Card, 
  CardContent, 
  CardActionArea 
} from '@mui/material';
import { Link } from 'react-router-dom';

const ProfileFriends = ({ userId }) => {
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(`/api/friends/${userId}`);
        setFriends(response.data.friends);
      } catch (error) {
        console.error('Error fetching friends:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriends();
  }, [userId]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Friends ({friends.length})
      </Typography>
      
      {friends.length === 0 ? (
        <Typography>No friends to display</Typography>
      ) : (
        <Grid container spacing={2}>
          {friends.map(friend => (
            <Grid item xs={12} sm={6} md={4} key={friend._id}>
              <Card>
                <CardActionArea component={Link} to={`/profile/${friend.username}`}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={friend.avatar} sx={{ width: 56, height: 56 }} />
                    <Typography variant="subtitle1">{friend.name}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ProfileFriends;