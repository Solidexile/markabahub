import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import {
    Box,
    Container,
    CircularProgress,
    Button,
    Typography,
    Grid
} from '@mui/material';
import CreatePost from '../../components/Post/CreatePost';
import PostCard from '../../components/Post/PostCard';
import Stories from '../../components/Stories/Stories';
import TrendingSidebar from '../../components/Sidebar/TrendingSidebar';

const HomePage = () => {
    const { currentUser } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/feed?page=${page}&limit=5`);
                setPosts(prev => [...prev, ...response.data.data]);
                setHasMore(response.data.data.length > 0);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [page]);

    const handlePostCreated = (newPost) => {
        setPosts(prev => [newPost, ...prev]);
    };

    const handleDeletePost = (postId) => {
        setPosts(prev => prev.filter(post => post._id !== postId));
    };

    const loadMorePosts = () => {
        setPage(prev => prev + 1);
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ display: 'flex', gap: 3, pt: 3 }}>
                {/* Left Sidebar */}
                <Box sx={{ width: 300, display: { xs: 'none', md: 'block' } }}>
                    <TrendingSidebar />
                </Box>

                {/* Main Content */}
                <Box sx={{ flexGrow: 1 }}>
                    <Stories />

                    {currentUser && (
                        <CreatePost onPostCreated={handlePostCreated} />
                    )}

                    {posts.length === 0 && !loading ? (
                        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                            No posts to display. Follow more people to see their posts!
                        </Typography>
                    ) : (
                        <>
                            <Grid container spacing={3} sx={{ mt: 1 }}>
                                {posts.map(post => (
                                    <Grid item xs={12} sm={6} md={4} key={post._id}>
                                        <PostCard
                                            post={post}
                                            onDelete={handleDeletePost}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                            {loading && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                                    <CircularProgress />
                                </Box>
                            )}
                            {hasMore && !loading && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={loadMorePosts}
                                    >
                                        Load More
                                    </Button>
                                </Box>
                            )}
                        </>
                    )}
                </Box>
            </Box>
        </Container>
    );
};

export default HomePage;