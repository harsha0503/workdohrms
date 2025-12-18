import api from './api';

export const holidayService = {
    getHolidays: (params = {}) => api.get('/holidays', { params }),
    getHoliday: (id) => api.get(`/holidays/${id}`),
    createHoliday: (data) => api.post('/holidays', data),
    updateHoliday: (id, data) => api.put(`/holidays/${id}`, data),
    deleteHoliday: (id) => api.delete(`/holidays/${id}`),

    // Import/Export
    importHolidays: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/holidays/import', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    exportHolidays: (params = {}) => api.get('/holidays/export', {
        params,
        responseType: 'blob'
    }),

    // Get holidays for a specific month/year
    getHolidaysForMonth: (year, month) => api.get('/holidays', {
        params: { year, month }
    }),

    // Check if date is holiday
    isHoliday: (date) => api.get('/holidays/check', { params: { date } }),
};
