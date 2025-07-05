import { Card, CardMedia, CardContent, Typography, Box, Chip, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const ItemCard = ({ item }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={item.images?.[0] || '/placeholder-item.jpg'}
        alt={item.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" component={Link} to={`/marketplace/${item.id}`} sx={{ textDecoration: 'none' }}>
            {item.title}
          </Typography>
          <Typography variant="h6" color="primary">
            ${item.price}
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" mb={2}>
          {item.description?.length > 100 
            ? `${item.description.substring(0, 100)}...` 
            : item.description}
        </Typography>
        
        <Box display="flex" alignItems="center" mb={1}>
          <LocationOnIcon color="action" fontSize="small" />
          <Typography variant="body2" color="text.secondary" ml={0.5}>
            {item.location}
          </Typography>
        </Box>
        
        <Chip 
          label={item.category} 
          size="small" 
          sx={{ textTransform: 'capitalize', mr: 1 }} 
        />
        <Chip 
          label={item.condition} 
          size="small" 
          color="secondary" 
          sx={{ textTransform: 'capitalize' }} 
        />
        
        <Box display="flex" alignItems="center" mt={2} pt={2} borderTop={1} borderColor="divider">
          <Avatar 
            src={item.user?.avatar} 
            sx={{ width: 32, height: 32, mr: 1 }} 
            component={Link} 
            to={`/profile/${item.user?.username}`}
          />
          <Typography variant="body2">
            {item.user?.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" ml="auto">
            {format(new Date(item.createdAt), 'MMM d, yyyy')}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ItemCard;