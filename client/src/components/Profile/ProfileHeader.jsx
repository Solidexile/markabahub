import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Box, 
  Typography, 
  Avatar, 
  Button, 
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Chip
} from '@mui/material';
import { Edit, MoreVert, Link as LinkIcon, LocationOn, Cake } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const ProfileHeader = ({ user, isCurrentUser }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { handleLogout } = useAuth();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const business = user.businessProfile || {};
  const showBusiness = business.businessName || business.businessDescription || business.businessLogo;

  return (
    <Box sx={{ mb: 4 }}>
      {/* Cover Photo */}
      <Box sx={{ 
        height: 200, 
        backgroundColor: 'grey.300',
        borderRadius: 1,
        position: 'relative'
      }}>
        {isCurrentUser && (
          <Button 
            startIcon={<Edit />}
            sx={{ 
              position: 'absolute',
              bottom: 16,
              right: 16,
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.7)'
              }
            }}
          >
            Edit Cover
          </Button>
        )}
      </Box>
      
      {/* Profile Info */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'flex-end',
        mt: -6,
        ml: 3,
        position: 'relative',
        zIndex: 1
      }}>
        <Avatar 
          src={showBusiness ? business.businessLogo : user.avatar} 
          sx={{ 
            width: 120, 
            height: 120, 
            border: '4px solid white',
            backgroundColor: 'background.paper'
          }} 
        />
        
        <Box sx={{ ml: 3, mb: 2, flexGrow: 1 }}>
          <Typography variant="h4" sx={{ color: 'var(--accent)', fontWeight: 'bold' }}>
            {showBusiness ? business.businessName : user.name}
          </Typography>
          {showBusiness && business.businessDescription && (
            <Typography variant="body1" sx={{ mt: 1, color: 'var(--navbar-text)' }}>
              {business.businessDescription}
            </Typography>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            {user.friends && (
              <Chip 
                label={`${user.friends.length} friends`} 
                component={Link}
                to={`/profile/${user.username}/friends`}
                clickable
                sx={{ mr: 1 }}
              />
            )}
            
            {(showBusiness && business.businessLocation) || user.location ? (
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <LocationOn fontSize="small" color="action" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  {showBusiness ? business.businessLocation : user.location}
                </Typography>
              </Box>
            ) : null}
          </Box>
        </Box>
        
        <Box>
          {isCurrentUser ? (
            <Button 
              variant="outlined" 
              startIcon={<Edit />}
              sx={{ mr: 1 }}
              component={Link}
              to="/setup-business"
            >
              Edit Business Profile
            </Button>
          ) : (
            <Button variant="contained">
              Add Friend
            </Button>
          )}
        </Box>
      </Box>
      
      {/* Bio and Details */}
      {!showBusiness && user.bio && (
        <Typography paragraph sx={{ mt: 2 }}>
          {user.bio}
        </Typography>
      )}
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {(showBusiness && business.businessWebsite) || user.website ? (
          <Button 
            startIcon={<LinkIcon />} 
            href={showBusiness ? business.businessWebsite : user.website}
            target="_blank"
            rel="noopener"
            size="small"
          >
            {(showBusiness ? business.businessWebsite : user.website)?.replace(/^https?:\/\//, '')}
          </Button>
        ) : null}
        
        {user.birthDate && (
          <Button 
            startIcon={<Cake />} 
            size="small"
          >
            Born {new Date(user.birthDate).toLocaleDateString()}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ProfileHeader;