import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Container, Typography, CircularProgress, Grid, Card, CardHeader, Avatar, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const SubscriptionsPage = () => {
  const { currentUser, token } = useAuth();
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/users/${currentUser._id}/subscriptions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSubs(res.data);
      } catch (e) {
        setSubs([]);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) fetchSubs();
  }, [currentUser, token]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ color: 'var(--accent)', mb: 3, fontWeight: 'bold' }}>
        Subscribed Businesses
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : subs.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          You haven't subscribed to any businesses yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {subs.map(user => (
            <Grid item xs={12} sm={6} md={4} key={user._id}>
              <Card sx={{ p: 2, borderRadius: 3, background: 'var(--search-bg)' }}>
                <CardHeader
                  avatar={<Avatar src={user.businessProfile?.businessLogo || user.avatar} />}
                  title={user.businessProfile?.businessName || user.name}
                  subheader={user.businessProfile?.businessDescription || user.bio}
                />
                <Button
                  component={Link}
                  to={`/profile/${user.username}`}
                  variant="contained"
                  sx={{ background: 'var(--accent)', color: '#fff', borderRadius: 2, fontWeight: 'bold', mt: 1 }}
                  fullWidth
                >
                  View Profile
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default SubscriptionsPage; 