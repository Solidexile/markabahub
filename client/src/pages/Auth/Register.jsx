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

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { handleRegister, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleRegister({ name, email, password });
        } catch (err) {
            setError('Registration failed. Please try again.');
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
                    Create your MarkabaHub account
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Divider sx={{ my: 2 }}>Sign up with email</Divider>

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        label="Full Name"
                        type="text"
                        fullWidth
                        margin="normal"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

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
                        {loading ? <CircularProgress size={24} /> : 'Sign Up'}
                    </Button>
                </Box>

                <Typography align="center" sx={{ mt: 2 }}>
                    Already have an account?{' '}
                    <Link href="/login" underline="hover">
                        Sign in
                    </Link>
                </Typography>
            </Box>
        </Container>
    );
};

export default RegisterPage; 