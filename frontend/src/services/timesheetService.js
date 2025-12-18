import api from './api';

export const timesheetService = {
    // Projects
    getProjects: (params) => api.get('/timesheet-projects', { params }),
    getProject: (id) => api.get(`/timesheet-projects/${id}`),
    createProject: (data) => api.post('/timesheet-projects', data),
    updateProject: (id, data) => api.put(`/timesheet-projects/${id}`, data),
    deleteProject: (id) => api.delete(`/timesheet-projects/${id}`),

    // Timesheets
    getTimesheets: (params) => api.get('/timesheets', { params }),
    getTimesheet: (id) => api.get(`/timesheets/${id}`),
    createTimesheet: (data) => api.post('/timesheets', data),
    updateTimesheet: (id, data) => api.put(`/timesheets/${id}`, data),
    deleteTimesheet: (id) => api.delete(`/timesheets/${id}`),
    bulkCreate: (data) => api.post('/timesheets/bulk', data),
    submitTimesheet: (id) => api.post(`/timesheets/${id}/submit`),
    approveTimesheet: (id) => api.post(`/timesheets/${id}/approve`),
    rejectTimesheet: (id, reason) => api.post(`/timesheets/${id}/reject`, { reason }),
    getSummary: (params) => api.get('/timesheet-summary', { params }),
    getEmployeeTimesheets: (employeeId) => api.get(`/timesheets/employee/${employeeId}`),
    getReport: (params) => api.get('/timesheet-report', { params }),

    // Shifts
    getShifts: () => api.get('/shifts'),
    createShift: (data) => api.post('/shifts', data),
    updateShift: (id, data) => api.put(`/shifts/${id}`, data),
    deleteShift: (id) => api.delete(`/shifts/${id}`),
    assignShift: (id, data) => api.post(`/shifts/${id}/assign`, data),
    getRoster: (params) => api.get('/shift-roster', { params }),
};

export default timesheetService;
