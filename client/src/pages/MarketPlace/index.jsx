import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Grid, CircularProgress, Box, Typography, InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ItemCard from '../../components/Marketplace/ItemCard';
import { useAuth } from '../../context/AuthContext';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

export default function MarketplacePage() {
  const { currentUser, token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/marketplace', { params: search ? { search } : {} });
        setItems(res.data.items || res.data);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [search]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!currentUser) return;
      try {
        const res = await axios.get(`/api/users/${currentUser._id}/marketplace-favorites`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavorites(res.data.map(item => item._id));
      } catch {}
    };
    fetchFavorites();
  }, [currentUser, token]);

  const handleFavorite = async (itemId) => {
    if (!currentUser) return;
    try {
      if (favorites.includes(itemId)) {
        await axios.delete(`/api/users/${currentUser._id}/marketplace-favorites/${itemId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavorites(favorites.filter(id => id !== itemId));
      } else {
        await axios.post(`/api/users/${currentUser._id}/marketplace-favorites/${itemId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavorites([...favorites, itemId]);
      }
    } catch {}
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <InputBase
          placeholder="Search marketplace..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{
            background: 'var(--search-bg)',
            color: 'var(--navbar-text)',
            px: 2,
            py: 1,
            borderRadius: 2,
            width: 350,
            mr: 2
          }}
        />
        <IconButton sx={{ color: 'var(--accent)' }}>
          <SearchIcon />
        </IconButton>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : items.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ mt: 6 }}>
          No marketplace items found.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {items.map(item => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Box sx={{ position: 'relative' }}>
                <ItemCard item={item} />
                {currentUser && (
                  <IconButton
                    onClick={() => handleFavorite(item._id)}
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      background: 'rgba(255,255,255,0.85)',
                      borderRadius: '50%',
                      zIndex: 2
                    }}
                  >
                    {favorites.includes(item._id) ? (
                      <FavoriteIcon sx={{ color: 'var(--accent)' }} />
                    ) : (
                      <FavoriteBorderIcon sx={{ color: 'var(--accent)' }} />
                    )}
                  </IconButton>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}