import api from "../utils/api";

export const authApi = {
    login: async (credentials) => {
        try {
            const response = await api.post('/login', credentials);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Login failed');
        }
    },

    logout: async () => {
        try {
            const response = await api.post('/logout');
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Logout failed');
        }
    },

    // Optional: Get current user profile
    getCurrentUser: async () => {
        try {
            const response = await api.get('/user/profile');
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Failed to fetch user profile');
        }
    }
};