import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  // Check auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get Firebase token
          const firebaseToken = await user.getIdToken();
          
          // Get backend token if doesn't exist
          let backendToken = localStorage.getItem('markabaHubToken');
          if (!backendToken) {
            const response = await axios.post('/api/auth/google', {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL
            });
            backendToken = response.data.token;
            localStorage.setItem('markabaHubToken', backendToken);
          }
          
          setToken(backendToken);
          
          // Get user data from backend
          const userResponse = await axios.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${backendToken}` }
          });
          
          setCurrentUser(userResponse.data);
        } catch (error) {
          console.error('Auth error:', error);
          handleLogout();
        }
      } else {
        setCurrentUser(null);
        setToken(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Google login handler
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const response = await axios.post('/api/auth/google', {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      });
      
      localStorage.setItem('markabaHubToken', response.data.token);
      setToken(response.data.token);
      setCurrentUser(response.data.user);
      navigate('/');
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

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
      await signOut(auth);
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
    handleGoogleLogin,
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