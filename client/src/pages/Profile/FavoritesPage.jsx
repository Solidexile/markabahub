import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Container, Typography, CircularProgress, Grid } from '@mui/material';
import PostCard from '../../components/Post/PostCard';

const FavoritesPage = () => {
  const { currentUser, token } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/users/${currentUser._id}/favorites`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavorites(res.data);
      } catch (e) {
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) fetchFavorites();
  }, [currentUser, token]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ color: 'var(--accent)', mb: 3, fontWeight: 'bold' }}>
        Your Favorites
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : favorites.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          You haven't favorited any posts yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {favorites.map(post => (
            <Grid item xs={12} sm={6} md={4} key={post._id}>
              <PostCard post={post} onDelete={() => setFavorites(favorites.filter(p => p._id !== post._id))} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default FavoritesPage; 