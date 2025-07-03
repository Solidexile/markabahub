import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
  Divider
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import ChatList from '../../components/Chat/ChatList';
import ChatWindow from '../../components/Chat/ChatWindow';

const ChatPage = () => {
  const { chatId } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
      {/* Chat list drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? drawerOpen : true}
        onClose={handleDrawerToggle}
        sx={{
          width: 350,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 350,
            boxSizing: 'border-box'
          }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
          {isMobile && (
            <IconButton onClick={handleDrawerToggle} sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6">Messages</Typography>
        </Box>
        <Divider />
        <ChatList />
      </Drawer>
      
      {/* Chat window */}
      <Box sx={{ flexGrow: 1 }}>
        {chatId ? (
          <ChatWindow chatId={chatId} />
        ) : (
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
          }}>
            <Typography variant="h6" color="text.secondary">
              Select a chat to start messaging
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChatPage;