import { useState, useEffect } from 'react';
import axios from 'axios';

const useMarketplace = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/marketplace');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching marketplace items:', error);
      setError('Failed to fetch marketplace items');
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (itemData) => {
    try {
      const response = await axios.post('/api/marketplace', itemData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('markabaHubToken')}`
        }
      });
      setItems(prev => [response.data, ...prev]);
      return response.data;
    } catch (error) {
      console.error('Error creating marketplace item:', error);
      throw error;
    }
  };

  const updateItem = async (itemId, itemData) => {
    try {
      const response = await axios.put(`/api/marketplace/${itemId}`, itemData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('markabaHubToken')}`
        }
      });
      setItems(prev => prev.map(item => item.id === itemId ? response.data : item));
      return response.data;
    } catch (error) {
      console.error('Error updating marketplace item:', error);
      throw error;
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await axios.delete(`/api/marketplace/${itemId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('markabaHubToken')}`
        }
      });
      setItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting marketplace item:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem
  };
};

export default useMarketplace;
