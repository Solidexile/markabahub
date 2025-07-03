import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import {
    Box,
    CircularProgress,
    Tabs,
    Tab,
    Container
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
                const response = await axios.get(`/api/users/${username}`);
                setProfileUser(response.data);

                // Check friendship status if not current user
                if (currentUser && currentUser._id !== response.data._id) {
                    const friendCheck = await axios.get(`/api/friends/status/${response.data._id}`);
                    setIsFriend(friendCheck.data.isFriend);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [username, currentUser]);

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (!profileUser) {
        return <Box>User not found</Box>;
    }

    const isCurrentUser = currentUser && currentUser._id === profileUser._id;

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
                {activeTab === 0 && null}
                {/* {activeTab === 1 && <ProfileAbout user={profileUser} />} */}
                {activeTab === 1 && null}
                {/* {activeTab === 2 && (
                    <ProfileFriends
                        userId={profileUser._id}
                        isPrivate={profileUser.privacy.friendListVisibility === 'private' && !isCurrentUser && !isFriend}
                    />
                )} */}
                {activeTab === 2 && null}
                {/* {activeTab === 3 && <ProfilePhotos userId={profileUser._id} />} */}
                {activeTab === 3 && null}
            </Box>
        </Container>
    );
};

export default ProfilePage;