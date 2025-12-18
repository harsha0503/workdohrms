import api from './api';

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/sign-in', { email, password });
        if (response.data.success) {
            // Backend returns 'token', but some might use 'access_token'
            const token = response.data.data.token || response.data.data.access_token;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },

    logout: async () => {
        await api.post('/auth/sign-out');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};
