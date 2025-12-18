import api from './api';

export const calendarService = {
    // Get all calendar events (combines different event types)
    getCalendarEvents: (params) => api.get('/calendar-events', { params }),

    // Individual event types
    getEvents: (params) => api.get('/events', { params }),
    getHolidays: (params) => api.get('/holidays', { params }),
    getMeetings: (params) => api.get('/meetings', { params }),
    getLeaves: (params) => api.get('/leave-applications', { params }),
    getInterviews: (params) => api.get('/interview-schedules', { params }),

    // Calendar settings
    getCalendarSettings: () => api.get('/calendar/settings'),
    updateCalendarSettings: (data) => api.post('/calendar/settings', data),
};

export default calendarService;
