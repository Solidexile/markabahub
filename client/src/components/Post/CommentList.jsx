import {
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Typography,
    Divider,
    Box
  } from '@mui/material';
  import TimeAgo from '../common/TimeAgo';
  
  const CommentList = ({ comments }) => {
    return (
      <List>
        {comments.map((comment, index) => (
          <Box key={index}>
            <ListItem alignItems="flex-start" sx={{ px: 0 }}>
              <ListItemAvatar>
                <Avatar src={comment.user.avatar} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    {comment.user.name}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography variant="body2">
                      {comment.content}
                    </Typography>
                    <TimeAgo date={comment.createdAt} />
                  </>
                }
              />
            </ListItem>
            {index < comments.length - 1 && <Divider variant="inset" />}
          </Box>
        ))}
      </List>
    );
  };
  
  export default CommentList;