import { useState, useEffect } from 'react';
import { Box, TextField, Button, MenuItem, Typography, Grid, IconButton } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import DeleteIcon from '@mui/icons-material/Delete';

const categories = [
  'electronics', 'furniture', 'clothing', 'vehicles', 'property', 'services', 'other'
];
const conditions = ['new', 'used', 'refurbished'];

const CreateListing = ({ editItem, onSuccess }) => {
  const { token } = useAuth();
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    images: [],
    location: '',
    condition: 'used'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (editItem) {
      setForm({ ...editItem, price: editItem.price.toString(), images: editItem.images || [] });
    }
  }, [editItem]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    try {
      // If you need to upload files, use your backend API instead
      // This is a placeholder and should be replaced with actual file upload logic
      const urls = await Promise.all(files.map(async (file) => {
        // Placeholder for file upload logic
        return 'placeholder-url';
      }));
      setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch (err) {
      setError('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== idx) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (editItem) {
        await axios.put(`/api/marketplace/${editItem._id}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('/api/marketplace', form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4, background: 'var(--search-bg)', borderRadius: 3, p: 3, boxShadow: 2 }}>
      <Typography variant="h5" sx={{ color: 'var(--accent)', mb: 2, fontWeight: 'bold' }}>
        {editItem ? 'Edit Listing' : 'Create New Listing'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          fullWidth
          required
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Price"
          name="price"
          value={form.price}
          onChange={handleChange}
          type="number"
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
          select
          fullWidth
          required
          sx={{ mb: 2 }}
        >
          {categories.map(cat => (
            <MenuItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Location"
          name="location"
          value={form.location}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Condition"
          name="condition"
          value={form.condition}
          onChange={handleChange}
          select
          fullWidth
          required
          sx={{ mb: 2 }}
        >
          {conditions.map(cond => (
            <MenuItem key={cond} value={cond}>{cond.charAt(0).toUpperCase() + cond.slice(1)}</MenuItem>
          ))}
        </TextField>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Images</Typography>
        <Button
          variant="outlined"
          component="label"
          sx={{ mb: 2 }}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload Images'}
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleFileChange}
          />
        </Button>
        <Grid container spacing={1}>
          {form.images.map((img, idx) => (
            <Grid item xs={4} key={idx}>
              <Box sx={{ position: 'relative' }}>
                <img src={img} alt="listing" style={{ width: '100%', borderRadius: 8, objectFit: 'cover', height: 80 }} />
                <IconButton size="small" sx={{ position: 'absolute', top: 2, right: 2, background: 'rgba(255,255,255,0.7)' }} onClick={() => removeImage(idx)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ background: 'var(--accent)', color: '#fff', fontWeight: 'bold', borderRadius: 2, py: 1.2, fontSize: 18, mt: 2 }}
          disabled={loading || uploading}
        >
          {loading ? (editItem ? 'Saving...' : 'Creating...') : (editItem ? 'Save Changes' : 'Create Listing')}
        </Button>
      </form>
    </Box>
  );
};

export default CreateListing;
