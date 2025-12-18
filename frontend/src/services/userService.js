import api from './api';

export const userService = {
    // Users
    getUsers: (params = {}) => api.get('/users', { params }),
    getUser: (id) => api.get(`/users/${id}`),
    createUser: (data) => api.post('/users', data),
    updateUser: (id, data) => api.put(`/users/${id}`, data),
    deleteUser: (id) => api.delete(`/users/${id}`),

    // Roles
    getRoles: (params = {}) => api.get('/roles', { params }),
    getRole: (id) => api.get(`/roles/${id}`),
    createRole: (data) => api.post('/roles', data),
    updateRole: (id, data) => api.put(`/roles/${id}`, data),
    deleteRole: (id) => api.delete(`/roles/${id}`),

    // Permissions
    getPermissions: () => api.get('/permissions'),

    // User Profile
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.put('/auth/profile', data),
    changePassword: (data) => api.post('/auth/change-password', data),

    // User Activity
    getActivityLog: (userId, params = {}) => api.get(`/users/${userId}/activity`, { params }),
};
