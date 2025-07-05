import { Avatar, Box, Button, Card, CardContent, Typography, Stack } from '@mui/material';
import { PersonAdd, Check, Clear } from '@mui/icons-material';

const FriendRequestCard = ({ request, onRespond }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            src={request.requester?.avatar} 
            sx={{ width: 56, height: 56, mr: 2 }}
          />
          <Box>
            <Typography variant="h6">{request.requester?.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              @{request.requester?.username}
            </Typography>
          </Box>
        </Box>
        
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<Check />}
            onClick={() => onRespond(request.id, 'accept')}
          >
            Accept
          </Button>
          <Button
            variant="outlined"
            startIcon={<Clear />}
            onClick={() => onRespond(request.id, 'decline')}
          >
            Decline
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default FriendRequestCard;