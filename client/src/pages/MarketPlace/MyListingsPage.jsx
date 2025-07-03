import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Container, Typography, CircularProgress, Grid, Button, Box, Modal } from '@mui/material';
import ItemCard from '../../components/Marketplace/ItemCard';
import CreateListing from '../../components/Marketplace/CreateListing';

const MyListingsPage = () => {
  const { currentUser, token } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/marketplace/user/${currentUser._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setListings(res.data);
      } catch (e) {
        setListings([]);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) fetchListings();
  }, [currentUser, token, showModal]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await axios.delete(`/api/marketplace/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setListings(listings.filter(item => item._id !== id));
    } catch {}
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditItem(null);
    setShowModal(true);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: 'var(--accent)', fontWeight: 'bold' }}>
          My Marketplace Listings
        </Typography>
        <Button variant="contained" sx={{ background: 'var(--accent)', color: '#fff', borderRadius: 2, fontWeight: 'bold' }} onClick={handleCreate}>
          Create New Listing
        </Button>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : listings.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          You haven't created any marketplace listings yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {listings.map(item => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Box sx={{ position: 'relative', pb: 5 }}>
                <ItemCard item={item} />
                <Box sx={{ position: 'absolute', bottom: 8, left: 8, right: 8, display: 'flex', gap: 1 }}>
                  <Button variant="outlined" size="small" sx={{ flex: 1 }} onClick={() => handleEdit(item)}>Edit</Button>
                  <Button variant="outlined" color="error" size="small" sx={{ flex: 1 }} onClick={() => handleDelete(item._id)}>Delete</Button>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 520, bgcolor: 'background.paper', borderRadius: 3, boxShadow: 24, p: 2 }}>
          <CreateListing editItem={editItem} onSuccess={() => setShowModal(false)} />
        </Box>
      </Modal>
    </Container>
  );
};

export default MyListingsPage; 