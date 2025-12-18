import api from './api';

export const eventsService = {
    // Company Events
    getEvents: (params) => api.get('/company-events', { params }),
    createEvent: (data) => api.post('/company-events', data),
    updateEvent: (id, data) => api.put(`/company-events/${id}`, data),
    deleteEvent: (id) => api.delete(`/company-events/${id}`),

    // Holidays
    getHolidays: (params) => api.get('/company-holidays', { params }),
    createHoliday: (data) => api.post('/company-holidays', data),
    updateHoliday: (id, data) => api.put(`/company-holidays/${id}`, data),
    deleteHoliday: (id) => api.delete(`/company-holidays/${id}`),

    // Calendar Data
    getCalendarData: (startDate, endDate) =>
        api.get('/calendar-data', { params: { start_date: startDate, end_date: endDate } })
};
