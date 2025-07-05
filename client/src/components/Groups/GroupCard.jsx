import { Avatar, Box, Button, Card, CardContent, Typography } from '@mui/material';
import { Group } from '@mui/icons-material';

const GroupCard = ({ group }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            sx={{ width: 56, height: 56, mr: 2, bgcolor: 'primary.main' }}
          >
            <Group />
          </Avatar>
          <Box>
            <Typography variant="h6">{group?.name || 'Group Name'}</Typography>
            <Typography variant="body2" color="text.secondary">
              {group?.memberCount || 0} members
            </Typography>
          </Box>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {group?.description || 'No description available'}
        </Typography>
        
        <Button variant="outlined" size="small">
          View Group
        </Button>
      </CardContent>
    </Card>
  );
};

export default GroupCard;
