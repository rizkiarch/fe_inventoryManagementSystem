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
import { Navigate, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { api } from '../../utils/api';
import { useSnackbar } from '../../context/SnackbarContext';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const { isAuthenticated, token } = useAuth();
    const { showSnackbar } = useSnackbar();
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
            try {
                // Simpan data secara berurutan
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.name));
                localStorage.setItem('role', JSON.stringify(data.role));

                // Tampilkan snackbar success
                showSnackbar('Login successful', 'success');

                // Tunggu sebentar sebelum navigate
                setTimeout(() => {
                    navigate('/dashboard', { replace: true });
                }, 100);
            } catch (err) {
                console.error('Error in onSuccess:', err);
                setError('Error processing login response');
            }
        },
        onError: (error) => {
            setError(error.response?.data?.message || 'Login failed');
            showSnackbar('Login failed', 'error');
        }
    });

    if (isAuthenticated && token) {
        return <Navigate to="/dashboard" />;
    }

    // const loginMutation = useMutation({
    //     mutationFn: async (credentials) => {
    //         const response = await api.post('/login', credentials);
    //         return response.data;
    //     },
    //     onSuccess: (data) => {
    //         try {
    //             // Simpan data secara berurutan
    //             localStorage.setItem('token', data.token);
    //             localStorage.setItem('user', JSON.stringify(data.name));
    //             localStorage.setItem('role', JSON.stringify(data.role));

    //             // Tampilkan snackbar success
    //             showSnackbar('Login successful', 'success');

    //             // Tunggu sebentar sebelum navigate
    //             setTimeout(() => {
    //                 navigate('/dashboard', { replace: true });
    //             }, 100);
    //         } catch (err) {
    //             console.error('Error in onSuccess:', err);
    //             setError('Error processing login response');
    //         }
    //     },
    //     onError: (error) => {
    //         setError(error.response?.data?.message || 'Login failed');
    //         showSnackbar('Login failed', 'error');
    //     }
    // });

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation(); // Tambahan untuk mencegah event bubbling
        setError('');

        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        try {
            await loginMutation.mutateAsync({ email, password });
        } catch (err) {
            console.error('Login error:', err);
        }
    };

    // Rest of the component remains the same...
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
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ mt: 3 }}
                    noValidate // Tambahan untuk mencegah validasi browser default
                >
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
                        disabled={loginMutation.isLoading}
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
                        disabled={loginMutation.isLoading}
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
                    disabled={loginMutation.isLoading}
                >
                    Superadmin
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => {
                        setEmail('admin@gmail.com');
                        setPassword('123123123');
                    }}
                    disabled={loginMutation.isLoading}
                >
                    Admin
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => {
                        setEmail('user@gmail.com');
                        setPassword('123123123');
                    }}
                    disabled={loginMutation.isLoading}
                >
                    Client
                </Button>
            </Box>
        </Container>
    );
};

export default Login;