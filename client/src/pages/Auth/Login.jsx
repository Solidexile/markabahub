import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Link,
    Divider,
    CircularProgress,
    Alert
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { handleGoogleLogin, handleEmailLogin, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleEmailLogin(email, password);
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{
                mt: 8,
                p: 4,
                boxShadow: 3,
                borderRadius: 2,
                backgroundColor: 'background.paper'
            }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Welcome to MarkabaHub
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<GoogleIcon />}
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    sx={{ mb: 2 }}
                >
                    Continue with Google
                </Button>

                <Divider sx={{ my: 2 }}>OR</Divider>

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        label="Email Address"
                        type="email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        sx={{ mt: 2, mb: 2 }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Sign In'}
                    </Button>
                </Box>

                <Typography align="center" sx={{ mt: 2 }}>
                    Don't have an account?{' '}
                    <Link href="/register" underline="hover">
                        Sign up
                    </Link>
                </Typography>
            </Box>
        </Container>
    );
};

export default LoginPage;