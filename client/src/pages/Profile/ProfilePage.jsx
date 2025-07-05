import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import {
    Box,
    CircularProgress,
    Tabs,
    Tab,
    Container,
    Typography
} from '@mui/material';
import ProfileHeader from '../../components/Profile/ProfileHeader';
// import ProfilePosts from '../../components/Profile/ProfilePosts';
// import ProfileAbout from '../../components/Profile/ProfileAbout';
// import ProfileFriends from '../../components/Profile/ProfileFriends';
// import ProfilePhotos from '../../components/Profile/ProfilePhotos';

const ProfilePage = () => {
    const { username } = useParams();
    const { currentUser } = useAuth();
    const [profileUser, setProfileUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);
    const [isFriend, setIsFriend] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`/api/users/profile/${username}`);
                setProfileUser(response.data);

                // Check friendship status if not current user
                if (currentUser && currentUser.id !== response.data.id) {
                    try {
                        const friendCheck = await axios.get(`/api/friends/status/${response.data.id}`);
                        setIsFriend(friendCheck.data.status === 'accepted');
                    } catch (error) {
                        console.error('Error checking friendship status:', error);
                    }
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (username) {
            fetchProfile();
        }
    }, [username, currentUser]);

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (!profileUser) {
        return (
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography variant="h5">User not found</Typography>
                    <Typography variant="body1" color="text.secondary">
                        The user you're looking for doesn't exist.
                    </Typography>
                </Box>
            </Container>
        );
    }

    const isCurrentUser = currentUser && currentUser.id === profileUser.id;

    return (
        <Container maxWidth="lg">
            <ProfileHeader
                user={profileUser}
                isCurrentUser={isCurrentUser}
            />

            <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ mb: 3 }}
            >
                <Tab label="Posts" />
                <Tab label="About" />
                <Tab label="Friends" />
                <Tab label="Photos" />
            </Tabs>

            <Box>
                {/* {activeTab === 0 && <ProfilePosts userId={profileUser._id} />} */}
                {activeTab === 0 && (
                    <Typography variant="body1" color="text.secondary">
                        Posts will appear here
                    </Typography>
                )}
                {/* {activeTab === 1 && <ProfileAbout user={profileUser} />} */}
                {activeTab === 1 && (
                    <Typography variant="body1" color="text.secondary">
                        About information will appear here
                    </Typography>
                )}
                {/* {activeTab === 2 && (
                    <ProfileFriends
                        userId={profileUser._id}
                        isPrivate={profileUser.privacy.friendListVisibility === 'private' && !isCurrentUser && !isFriend}
                    />
                )} */}
                {activeTab === 2 && (
                    <Typography variant="body1" color="text.secondary">
                        Friends list will appear here
                    </Typography>
                )}
                {/* {activeTab === 3 && <ProfilePhotos userId={profileUser._id} />} */}
                {activeTab === 3 && (
                    <Typography variant="body1" color="text.secondary">
                        Photos will appear here
                    </Typography>
                )}
            </Box>
        </Container>
    );
};

export default ProfilePage;