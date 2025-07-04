import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  // Check auth state on mount
  useEffect(() => {
    const backendToken = localStorage.getItem('markabaHubToken');
    if (backendToken) {
      setToken(backendToken);
      axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${backendToken}` }
      })
        .then((userResponse) => {
          setCurrentUser(userResponse.data);
        })
        .catch(() => {
          setCurrentUser(null);
          setToken(null);
          localStorage.removeItem('markabaHubToken');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Email/password login handler
  const handleEmailLogin = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('markabaHubToken', response.data.token);
      setToken(response.data.token);
      const userResponse = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${response.data.token}` }
      });
      setCurrentUser(userResponse.data);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const handleRegister = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/register', userData);
      localStorage.setItem('markabaHubToken', response.data.token);
      setToken(response.data.token);
      const userResponse = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${response.data.token}` }
      });
      setCurrentUser(userResponse.data);
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      localStorage.removeItem('markabaHubToken');
      setCurrentUser(null);
      setToken(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    currentUser,
    token,
    loading,
    handleEmailLogin,
    handleRegister,
    handleLogout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};