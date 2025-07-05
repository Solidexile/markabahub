import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import {
    Box,
    Dialog,
    IconButton,
    Avatar,
    Typography,
    LinearProgress,
    Tooltip
} from '@mui/material';
import { Close, ArrowBack, ArrowForward, Visibility } from '@mui/icons-material';

const StoryViewer = ({ stories, open, onClose, onStoryEnd }) => {
    const { currentUser } = useAuth();
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [paused, setPaused] = useState(false);
    const intervalRef = useRef(null);
    const currentStory = stories[currentStoryIndex];

    useEffect(() => {
        if (open && currentStory) {
            startProgress();
            markAsViewed();
        }
        return () => clearInterval(intervalRef.current);
    }, [open, currentStoryIndex]);

    const startProgress = () => {
        setProgress(0);
        clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(intervalRef.current);
                    handleNext();
                    return 0;
                }
                return paused ? prev : prev + 0.5;
            });
        }, 50);
    };

    const markAsViewed = async () => {
        try {
            await axios.put(`/api/stories/${currentStory.id}/view`);
        } catch (error) {
            console.error('Error marking story as viewed:', error);
        }
    };

    const handleNext = () => {
        if (currentStoryIndex < stories.length - 1) {
            setCurrentStoryIndex(prev => prev + 1);
        } else {
            onStoryEnd();
        }
    };

    const handlePrev = () => {
        if (currentStoryIndex > 0) {
            setCurrentStoryIndex(prev => prev - 1);
        }
    };

    const handleClose = () => {
        clearInterval(intervalRef.current);
        onClose();
    };

    if (!currentStory) return null;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullScreen
            PaperProps={{
                sx: {
                    bgcolor: 'black',
                    overflow: 'hidden'
                }
            }}
        >
            {/* Progress bars */}
            <Box sx={{
                display: 'flex',
                gap: 1,
                position: 'absolute',
                top: 16,
                left: 16,
                right: 16,
                zIndex: 1
            }}>
                {stories.map((story, index) => (
                    <Box key={story.id} sx={{ flexGrow: 1 }}>
                        <LinearProgress
                            variant="determinate"
                            value={index < currentStoryIndex ? 100 : index === currentStoryIndex ? progress : 0}
                            sx={{
                                height: 4,
                                borderRadius: 2,
                                backgroundColor: 'rgba(255,255,255,0.3)',
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: 'white'
                                }
                            }}
                        />
                    </Box>
                ))}
            </Box>

            {/* Header */}
            <Box sx={{
                position: 'absolute',
                top: 48,
                left: 16,
                right: 16,
                zIndex: 1,
                display: 'flex',
                alignItems: 'center'
            }}>
                <Avatar
                    src={currentStory.user?.avatar}
                    sx={{ width: 40, height: 40, mr: 2 }}
                />
                <Typography variant="subtitle1" color="white" sx={{ flexGrow: 1 }}>
                    {currentStory.user?.name}
                </Typography>
                <Tooltip title="Close" arrow>
                    <IconButton onClick={handleClose} sx={{ color: 'white' }}>
                        <Close />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Story content */}
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                onMouseDown={() => setPaused(true)}
                onMouseUp={() => setPaused(false)}
                onTouchStart={() => setPaused(true)}
                onTouchEnd={() => setPaused(false)}
            >
                {currentStory.mediaType === 'image' ? (
                    <img
                        src={currentStory.media}
                        alt="Story"
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain'
                        }}
                    />
                ) : (
                    <video
                        src={currentStory.media}
                        controls
                        autoPlay
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain'
                        }}
                    />
                )}
            </Box>

            {/* Navigation arrows */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: '50%',
                    zIndex: 1,
                    cursor: 'pointer'
                }}
                onClick={handlePrev}
            />
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    right: 0,
                    width: '50%',
                    zIndex: 1,
                    cursor: 'pointer'
                }}
                onClick={handleNext}
            />

            {/* Footer */}
            {currentStory.caption && (
                <Box sx={{
                    position: 'absolute',
                    bottom: 32,
                    left: 0,
                    right: 0,
                    textAlign: 'center',
                    zIndex: 1
                }}>
                    <Typography
                        variant="body1"
                        color="white"
                        sx={{
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            display: 'inline-block',
                            px: 2,
                            py: 1,
                            borderRadius: 1
                        }}
                    >
                        {currentStory.caption}
                    </Typography>
                </Box>
            )}

            {/* View count */}
            <Box sx={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
                px: 1,
                py: 0.5,
                borderRadius: 1
            }}>
                <Visibility fontSize="small" sx={{ color: 'white', mr: 0.5 }} />
                <Typography variant="body2" color="white">
                    {currentStory.viewCount}
                </Typography>
            </Box>
        </Dialog>
    );
};

export default StoryViewer;