import React, { useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Paper,
    Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { api } from '../../utils/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const loginMutation = useMutation({
        mutationFn: async (credentials) => {
            const response = await api.post('/login', credentials);
            return response.data;
        },
        onSuccess: (data) => {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.name));
            navigate('/dashboard');
        },
        onError: (error) => {
            setError(error.response?.data?.message || 'Login failed');
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        loginMutation.mutate({ email, password });
    };

    return (
        <Container maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Inventory Management Login
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoFocus
                        autoComplete='off'
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete='off'
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loginMutation.isLoading}
                    >
                        {loginMutation.isLoading ? 'Logging in...' : 'Sign In'}
                    </Button>
                </Box>
            </Box>

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Button
                    variant="outlined"
                    onClick={() => {
                        setEmail('ikay@gmail.com');
                        setPassword('123123123');
                    }}
                >
                    Superadmin
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => {
                        setEmail('admin@gmail.com');
                        setPassword('123123123');
                    }}
                >
                    Admin
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => {
                        setEmail('user@gmail.com');
                        setPassword('123123123');
                    }}
                >
                    Client
                </Button>
            </Box>
        </Container>
    );
};

export default Login;