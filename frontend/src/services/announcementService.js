import api from './api';

export const announcementService = {
    getAnnouncements: (params = {}) => api.get('/announcements', { params }),
    getAnnouncement: (id) => api.get(`/announcements/${id}`),
    createAnnouncement: (data) => api.post('/announcements', data),
    updateAnnouncement: (id, data) => api.put(`/announcements/${id}`, data),
    deleteAnnouncement: (id) => api.delete(`/announcements/${id}`),

    // Get employees for announcement
    getEmployees: () => api.get('/staff-members'),

    // Get departments for announcement
    getDepartments: () => api.get('/organization/departments'),

    // Get branches for announcement
    getBranches: () => api.get('/organization/branches'),

    // Mark as read
    markAsRead: (id) => api.post(`/announcements/${id}/read`),

    // Get unread count
    getUnreadCount: () => api.get('/announcements/unread-count'),
};
