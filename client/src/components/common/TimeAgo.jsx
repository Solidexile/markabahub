import { Typography } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';

const TimeAgo = ({ date }) => {
  return (
    <Typography variant="body2" color="text.secondary">
      {formatDistanceToNow(new Date(date), { addSuffix: true })}
    </Typography>
  );
};

export default TimeAgo;