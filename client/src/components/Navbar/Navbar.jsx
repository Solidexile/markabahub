import { AppBar, Toolbar, Typography, InputBase, Avatar, Badge, IconButton, Button, Menu, MenuItem } from '@mui/material';
import { Search, Notifications, Message, Home, Store, People } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { Box } from "@mui/material";
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { currentUser, handleLogout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [search, setSearch] = useState("");

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement search logic
    alert(`Search for: ${search}`);
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: 'var(--navbar-bg)', color: 'var(--navbar-text)', boxShadow: 'none' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left Side - Logo */}
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          sx={{ 
            textDecoration: 'none', 
            color: 'var(--accent)',
            fontWeight: 'bold',
            fontSize: '1.8rem',
            letterSpacing: 1
          }}
        >
          MarkabaHub
        </Typography>
        {/* Center - Search */}
        <Box component="form" onSubmit={handleSearchSubmit} sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          backgroundColor: 'var(--search-bg)',
          borderRadius: 2,
          px: 2,
          py: 0.5,
          width: { xs: '60%', md: '40%' }
        }}>
          <Search sx={{ color: 'var(--search-icon)', mr: 1 }} />
          <InputBase 
            placeholder="Search MarkabaHub..." 
            sx={{ width: '100%', color: 'var(--navbar-text)' }}
            value={search}
            onChange={handleSearchChange}
          />
        </Box>
        {/* Right Side - Icons/Auth */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton component={Link} to="/" sx={{ color: 'var(--navbar-icon)' }}>
            <Home fontSize="large" />
          </IconButton>
          <IconButton component={Link} to="/friends" sx={{ color: 'var(--navbar-icon)' }}>
            <People fontSize="large" />
          </IconButton>
          <IconButton component={Link} to="/marketplace" sx={{ color: 'var(--navbar-icon)' }}>
            <Store fontSize="large" />
          </IconButton>
          <IconButton component={Link} to="/notifications" sx={{ color: 'var(--navbar-icon)' }}>
            <Badge badgeContent={4} color="error">
              <Notifications fontSize="large" />
            </Badge>
          </IconButton>
          <IconButton component={Link} to="/chat" sx={{ color: 'var(--navbar-icon)' }}>
            <Badge badgeContent={2} color="error">
              <Message fontSize="large" />
            </Badge>
          </IconButton>
          {currentUser ? (
            <>
              <IconButton onClick={handleAvatarClick}>
                <Avatar 
                  src={currentUser?.avatar} 
                  sx={{ width: 36, height: 36 }} 
                />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem component={Link} to={`/profile/${currentUser?.username}`} onClick={handleMenuClose}>Profile</MenuItem>
                <MenuItem component={Link} to="/favorites" onClick={handleMenuClose}>Favorites</MenuItem>
                <MenuItem component={Link} to="/subscriptions" onClick={handleMenuClose}>Subscriptions</MenuItem>
                <MenuItem component={Link} to="/marketplace/favorites" onClick={handleMenuClose}>Marketplace Favorites</MenuItem>
                <MenuItem component={Link} to="/marketplace/my-listings" onClick={handleMenuClose}>My Listings</MenuItem>
                <MenuItem onClick={() => { handleLogout(); handleMenuClose(); }}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button 
              variant="contained" 
              component={Link}
              to="/login"
              sx={{ backgroundColor: 'var(--accent)', color: '#fff', fontWeight: 'bold', borderRadius: 2, px: 3 }}
            >
              Sign In
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;