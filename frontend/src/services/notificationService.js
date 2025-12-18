import api from './api';

export const notificationService = {
    // Get all notifications
    getNotifications: (params = {}) => api.get('/notifications', { params }),

    // Get unread count
    getUnreadCount: () => api.get('/notifications/unread-count'),

    // Mark as read
    markAsRead: (id) => api.post(`/notifications/${id}/read`),

    // Mark all as read
    markAllAsRead: () => api.post('/notifications/read-all'),

    // Delete notification
    deleteNotification: (id) => api.delete(`/notifications/${id}`),

    // Clear all notifications
    clearAll: () => api.delete('/notifications/clear'),

    // Email notifications
    sendEmail: (data) => api.post('/notifications/email', data),

    // Send meeting invite
    sendMeetingInvite: (meetingId, recipientIds) => api.post(`/meetings/${meetingId}/invite`, { recipient_ids: recipientIds }),

    // Send payslip email
    sendPayslipEmail: (payslipId) => api.post(`/payslips/${payslipId}/email`),

    // Send bulk payslip emails
    sendBulkPayslipEmails: (payslipIds) => api.post('/payslips/bulk-email', { payslip_ids: payslipIds }),

    // Event reminder
    setEventReminder: (eventId, reminderData) => api.post(`/events/${eventId}/reminder`, reminderData),

    // Get notification settings
    getSettings: () => api.get('/notification-settings'),
    updateSettings: (data) => api.put('/notification-settings', data),
};
