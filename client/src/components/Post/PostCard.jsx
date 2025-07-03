import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { 
  Avatar,
  Box,
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Button,
  Divider,
  Chip
} from '@mui/material';
import { 
  MoreVert,
  ThumbUp,
  Comment,
  Share,
  Send,
  Favorite,
  FavoriteBorder,
  Bookmark,
  BookmarkBorder,
  PersonAdd,
  PersonRemove
} from '@mui/icons-material';
import TimeAgo from '../common/TimeAgo';
import CommentList from './CommentList';

const PostCard = ({ post, onDelete }) => {
  const { currentUser, token } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(post.comments);
  const [isLiked, setIsLiked] = useState(
    post.likes.some(like => like.user._id === currentUser?._id)
  );
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [showComments, setShowComments] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Check if post is favorited
    const checkFavorite = async () => {
      if (!currentUser) return;
      try {
        const res = await axios.get(`/api/users/${currentUser._id}/favorites`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsFavorited(res.data.some(fav => fav._id === post._id));
      } catch (e) { /* ignore */ }
    };
    // Check if subscribed to post's user
    const checkSubscribed = async () => {
      if (!currentUser) return;
      try {
        const res = await axios.get(`/api/users/${currentUser._id}/subscriptions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsSubscribed(res.data.some(u => u._id === post.user._id));
      } catch (e) { /* ignore */ }
    };
    checkFavorite();
    checkSubscribed();
    // eslint-disable-next-line
  }, [currentUser, post._id, post.user._id]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLike = async () => {
    try {
      const response = await axios.put(`/api/posts/like/${post._id}`);
      setIsLiked(!isLiked);
      setLikeCount(response.data.likes.length);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    try {
      const response = await axios.post(`/api/posts/comment/${post._id}`, {
        content: comment
      });
      
      setComments([...comments, response.data]);
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeletePost = async () => {
    try {
      await axios.delete(`/api/posts/${post._id}`);
      onDelete(post._id);
      handleMenuClose();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleFavorite = async () => {
    if (!currentUser) return;
    try {
      if (isFavorited) {
        await axios.delete(`/api/users/${currentUser._id}/favorites/${post._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsFavorited(false);
      } else {
        await axios.post(`/api/users/${currentUser._id}/favorites/${post._id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsFavorited(true);
      }
    } catch (e) { /* ignore */ }
  };

  const handleSubscribe = async () => {
    if (!currentUser) return;
    try {
      if (isSubscribed) {
        await axios.delete(`/api/users/${currentUser._id}/subscribe/${post.user._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsSubscribed(false);
      } else {
        await axios.post(`/api/users/${currentUser._id}/subscribe/${post.user._id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsSubscribed(true);
      }
    } catch (e) { /* ignore */ }
  };

  return (
    <Card sx={{
      mb: 3,
      borderRadius: 4,
      background: 'var(--search-bg)',
      boxShadow: '0 2px 16px rgba(0,0,0,0.10)',
      maxWidth: 500,
      margin: '32px auto',
      overflow: 'hidden',
      border: '1.5px solid var(--navbar-bg)'
    }}>
      {/* Post Header */}
      <CardHeader
        avatar={
          <Avatar 
            src={post.user.avatar} 
            alt={post.user.name} 
            component="a"
            href={`/profile/${post.user.username}`}
          />
        }
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Subscribe button (not for own posts) */}
            {currentUser?._id !== post.user._id && (
              <Button
                size="small"
                variant={isSubscribed ? 'outlined' : 'contained'}
                sx={{
                  background: isSubscribed ? 'transparent' : 'var(--accent)',
                  color: isSubscribed ? 'var(--accent)' : '#fff',
                  borderColor: 'var(--accent)',
                  borderRadius: 2,
                  fontWeight: 'bold',
                  px: 2,
                  mr: 1
                }}
                startIcon={isSubscribed ? <PersonRemove /> : <PersonAdd />}
                onClick={handleSubscribe}
              >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </Button>
            )}
            {currentUser?._id === post.user._id && (
              <>
                <IconButton onClick={handleMenuOpen}>
                  <MoreVert />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleDeletePost}>Delete Post</MenuItem>
                  <MenuItem onClick={handleMenuClose}>Edit Post</MenuItem>
                </Menu>
              </>
            )}
          </Box>
        }
        title={
          <Box>
            <Typography 
              component="a" 
              href={`/profile/${post.user.username}`}
              sx={{ fontWeight: 'bold', textDecoration: 'none', color: 'inherit' }}
            >
              {post.user.name}
            </Typography>
            {post.privacy === 'friends' && (
              <Chip 
                label="Friends" 
                size="small" 
                sx={{ ml: 1, height: 18 }} 
              />
            )}
            {post.privacy === 'private' && (
              <Chip 
                label="Only Me" 
                size="small" 
                sx={{ ml: 1, height: 18 }} 
              />
            )}
          </Box>
        }
        subheader={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TimeAgo date={post.createdAt} />
            {post.location && (
              <>
                <span style={{ margin: '0 5px' }}>·</span>
                <Typography variant="body2" color="text.secondary">
                  {post.location}
                </Typography>
              </>
            )}
          </Box>
        }
      />
      
      {/* Post Content */}
      <CardContent sx={{ pb: 0 }}>
        <Typography variant="body1" paragraph sx={{ color: 'var(--navbar-text)', fontSize: 17 }}>
          {post.content}
        </Typography>
      </CardContent>
      
      {/* Post Images */}
      {post.images?.length > 0 && (
        <CardMedia
          component="img"
          image={post.images[0]}
          alt="Post image"
          sx={{
            width: '100%',
            maxHeight: 400,
            objectFit: 'cover',
            borderRadius: 3,
            margin: '0 auto',
            boxShadow: '0 2px 8px rgba(0,0,0,0.10)'
          }}
        />
      )}
      
      {/* Post Stats */}
      <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body2" color="text.secondary">
          {likeCount} likes
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {comments.length} comments
        </Typography>
      </Box>
      
      <Divider />
      
      {/* Post Actions */}
      <CardActions sx={{ justifyContent: 'space-around', pb: 1 }}>
        <Button 
          startIcon={isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
          onClick={handleLike}
          sx={{ color: isLiked ? 'error.main' : 'inherit', fontWeight: 'bold' }}
        >
          Like
        </Button>
        <Button 
          startIcon={<Comment />}
          onClick={() => setShowComments(!showComments)}
          sx={{ fontWeight: 'bold' }}
        >
          Comment
        </Button>
        <Button 
          startIcon={isFavorited ? <Bookmark color="primary" /> : <BookmarkBorder />} 
          onClick={handleFavorite}
          sx={{ color: isFavorited ? 'var(--accent)' : 'inherit', fontWeight: 'bold' }}
        >
          Favorite
        </Button>
        <Button startIcon={<Share />} sx={{ fontWeight: 'bold' }}>Share</Button>
      </CardActions>
      
      {showComments && (
        <Box sx={{ px: 2, pb: 2 }}>
          <Divider sx={{ mb: 1 }} />
          <CommentList comments={comments} />
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Avatar src={currentUser?.avatar} sx={{ width: 28, height: 28, mr: 1 }} />
            <TextField
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Add a comment..."
              size="small"
              sx={{ flex: 1, background: 'var(--navbar-bg)', borderRadius: 2 }}
              InputProps={{ style: { color: 'var(--navbar-text)' } }}
            />
            <Button onClick={handleAddComment} disabled={!comment.trim()} sx={{ ml: 1, color: 'var(--accent)', fontWeight: 'bold' }}>
              Post
            </Button>
          </Box>
        </Box>
      )}
    </Card>
  );
};

export default PostCard;