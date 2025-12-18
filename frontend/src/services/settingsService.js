import api from './api';

export const settingsService = {
    // Company Settings
    getCompanySettings: () => api.get('/settings/company'),
    updateCompanySettings: (data) => api.put('/settings/company', data),
    uploadCompanyLogo: (file) => {
        const formData = new FormData();
        formData.append('logo', file);
        return api.post('/settings/company/logo', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    uploadCompanyFavicon: (file) => {
        const formData = new FormData();
        formData.append('favicon', file);
        return api.post('/settings/company/favicon', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    // System Settings
    getSystemSettings: () => api.get('/settings/system'),
    updateSystemSettings: (data) => api.put('/settings/system', data),

    // Email Settings
    getEmailSettings: () => api.get('/settings/email'),
    updateEmailSettings: (data) => api.put('/settings/email', data),
    testEmailSettings: (data) => api.post('/settings/email/test', data),

    // Payment Settings
    getPaymentSettings: () => api.get('/settings/payment'),
    updatePaymentSettings: (data) => api.put('/settings/payment', data),

    // IP Restrictions
    getIPRestrictions: () => api.get('/settings/ip-restrictions'),
    addIPRestriction: (data) => api.post('/settings/ip-restrictions', data),
    deleteIPRestriction: (id) => api.delete(`/settings/ip-restrictions/${id}`),

    // HRM Settings
    getHRMSettings: () => api.get('/settings/hrm'),
    updateHRMSettings: (data) => api.put('/settings/hrm', data),

    // Attendance Settings
    getAttendanceSettings: () => api.get('/settings/attendance'),
    updateAttendanceSettings: (data) => api.put('/settings/attendance', data),

    // Payroll Settings
    getPayrollSettings: () => api.get('/settings/payroll'),
    updatePayrollSettings: (data) => api.put('/settings/payroll', data),

    // Leave Settings
    getLeaveSettings: () => api.get('/settings/leave'),
    updateLeaveSettings: (data) => api.put('/settings/leave', data),

    // Notification Settings
    getNotificationSettings: () => api.get('/settings/notifications'),
    updateNotificationSettings: (data) => api.put('/settings/notifications', data),

    // Template Settings (for documents)
    getDocumentTemplates: () => api.get('/settings/document-templates'),
    updateDocumentTemplate: (type, content) => api.put(`/settings/document-templates/${type}`, { content }),

    // Currency Settings
    getCurrencies: () => api.get('/settings/currencies'),
    getDefaultCurrency: () => api.get('/settings/currencies/default'),
    setDefaultCurrency: (currencyId) => api.put('/settings/currencies/default', { currency_id: currencyId }),

    // Languages
    getLanguages: () => api.get('/settings/languages'),
    getDefaultLanguage: () => api.get('/settings/languages/default'),
    setDefaultLanguage: (langCode) => api.put('/settings/languages/default', { language: langCode }),
};
