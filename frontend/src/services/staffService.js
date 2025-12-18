import api from './api';

export const staffService = {
    getStaff: (params) => api.get('/staff-members', { params }),
    getStaffById: (id) => api.get(`/staff-members/${id}`),
    createStaff: (data) => api.post('/staff-members', data),
    updateStaff: (id, data) => api.put(`/staff-members/${id}`, data),
    deleteStaff: (id) => api.delete(`/staff-members/${id}`),
    getStaffDropdown: () => api.get('/staff-members-dropdown'),
    importStaff: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/imports/staff-members', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    exportStaff: () => api.get('/exports/staff-members', { responseType: 'blob' })
};
