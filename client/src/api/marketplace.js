import axios from 'axios';

const API_URL = '/api/marketplace';

// Create new marketplace item
const createItem = async (itemData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, itemData, config);
  return response.data;
};

// Get all marketplace items
const getItems = async (filters = {}, page = 1) => {
  const params = { ...filters, page };
  const response = await axios.get(API_URL, { params });
  return response.data;
};

// Get single marketplace item
const getItemById = async (itemId) => {
  const response = await axios.get(`${API_URL}/${itemId}`);
  return response.data;
};

// Update marketplace item
const updateItem = async (itemId, itemData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(`${API_URL}/${itemId}`, itemData, config);
  return response.data;
};

// Delete marketplace item
const deleteItem = async (itemId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(`${API_URL}/${itemId}`, config);
  return response.data;
};

// Get items by user
const getItemsByUser = async (userId) => {
  const response = await axios.get(`${API_URL}/user/${userId}`);
  return response.data;
};

const marketplaceService = {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  getItemsByUser,
};

export default marketplaceService;