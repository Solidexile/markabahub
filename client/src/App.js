import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./pages/Home/HomePage";
import ProfilePage from './pages/Profile/ProfilePage';
import FriendsPage from './pages/Friends/FriendsPage';
import ChatPage from './pages/Chat/ChatPage';
import NotificationsPage from './pages/Notifications/NotificationsPage';
import MarketPlacePage from './pages/MarketPlace/index';
import StoriesPage from './pages/Stories/StoriesPage';
import LoginPage from './pages/Auth/Login';
import SettingsPage from './pages/Settings/AccountSettings';
import AccountSettings from './pages/Settings/AccountSettings';
import PrivacySettings from './pages/Settings/PrivacySettings';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/theme';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import PrivateRoute from './components/common/PrivateRoute';
import Navbar from './components/Navbar/Navbar';
import BusinessProfileSetup from './pages/Profile/BusinessProfileSetup';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FavoritesPage from './pages/Profile/FavoritesPage';
import SubscriptionsPage from './pages/Profile/SubscriptionsPage';
import MarketplaceFavoritesPage from './pages/MarketPlace/MarketplaceFavoritesPage';
import MyListingsPage from './pages/MarketPlace/MyListingsPage';
import RegisterPage from './pages/Auth/Register';

// Guard to redirect to business profile setup if not complete
function BusinessProfileGuard({ children }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && currentUser && currentUser.businessProfile && !currentUser.businessProfile.isBusinessProfileComplete && location.pathname !== '/setup-business') {
      navigate('/setup-business');
    }
  }, [currentUser, loading, location.pathname, navigate]);

  return children;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AuthProvider>
          <SocketProvider>
            <Navbar />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/setup-business" element={<PrivateRoute><BusinessProfileSetup /></PrivateRoute>} />
              <Route path="/" element={<PrivateRoute><BusinessProfileGuard><HomePage /></BusinessProfileGuard></PrivateRoute>} />
              <Route path="/profile/:username" element={<PrivateRoute><BusinessProfileGuard><ProfilePage /></BusinessProfileGuard></PrivateRoute>} />
              <Route path="/friends" element={<PrivateRoute><BusinessProfileGuard><FriendsPage /></BusinessProfileGuard></PrivateRoute>} />
              <Route path="/chat" element={<PrivateRoute><BusinessProfileGuard><ChatPage /></BusinessProfileGuard></PrivateRoute>} />
              <Route path="/chat/:chatId" element={<PrivateRoute><BusinessProfileGuard><ChatPage /></BusinessProfileGuard></PrivateRoute>} />
              <Route path="/notifications" element={<PrivateRoute><BusinessProfileGuard><NotificationsPage /></BusinessProfileGuard></PrivateRoute>} />
              <Route path="/marketplace" element={<PrivateRoute><BusinessProfileGuard><MarketPlacePage /></BusinessProfileGuard></PrivateRoute>} />
              <Route path="/stories" element={<PrivateRoute><BusinessProfileGuard><StoriesPage /></BusinessProfileGuard></PrivateRoute>} />
              <Route path="/favorites" element={<PrivateRoute><BusinessProfileGuard><FavoritesPage /></BusinessProfileGuard></PrivateRoute>} />
              <Route path="/subscriptions" element={<PrivateRoute><BusinessProfileGuard><SubscriptionsPage /></BusinessProfileGuard></PrivateRoute>} />
              <Route path="/marketplace/favorites" element={<PrivateRoute><BusinessProfileGuard><MarketplaceFavoritesPage /></BusinessProfileGuard></PrivateRoute>} />
              <Route path="/marketplace/my-listings" element={<PrivateRoute><BusinessProfileGuard><MyListingsPage /></BusinessProfileGuard></PrivateRoute>} />
              <Route path="/settings" element={<PrivateRoute><BusinessProfileGuard><SettingsPage /></BusinessProfileGuard></PrivateRoute>} >
                <Route path="account" element={<AccountSettings />} />
                <Route path="privacy" element={<PrivacySettings />} />
              </Route>
            </Routes>
          </SocketProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;