import api from './api';

export const attendanceService = {
    // Clock In/Out
    clockIn: () => api.post('/attendance/clock-in'),
    clockOut: () => api.post('/attendance/clock-out'),
    getClockStatus: () => api.get('/attendance/status'),

    // Attendance Records
    getAttendance: (params = {}) => api.get('/attendance', { params }),
    getMyAttendance: (params = {}) => api.get('/attendance/my', { params }),
    getAttendanceByDate: (date) => api.get('/attendance/date/' + date),
    getAttendanceByEmployee: (employeeId, params = {}) => api.get(`/attendance/employee/${employeeId}`, { params }),

    // Daily Attendance
    getDailyAttendance: (date) => api.get('/attendance/daily', { params: { date } }),
    markAttendance: (data) => api.post('/attendance/mark', data),
    updateAttendance: (id, data) => api.put(`/attendance/${id}`, data),
    deleteAttendance: (id) => api.delete(`/attendance/${id}`),

    // Bulk Attendance
    getBulkAttendance: (date, department_id = null) => api.get('/attendance/bulk', {
        params: { date, department_id }
    }),
    saveBulkAttendance: (data) => api.post('/attendance/bulk', data),

    // Monthly Summary
    getMonthlySummary: (month, year, employeeId = null) => api.get('/attendance/monthly-summary', {
        params: { month, year, employee_id: employeeId }
    }),

    // Import/Export
    importAttendance: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/attendance/import', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    exportAttendance: (params = {}) => api.get('/attendance/export', {
        params,
        responseType: 'blob'
    }),

    downloadImportTemplate: () => api.get('/attendance/import/template', {
        responseType: 'blob'
    }),

    // Statistics
    getAttendanceStats: (params = {}) => api.get('/attendance/stats', { params }),
    getDepartmentStats: (params = {}) => api.get('/attendance/stats/department', { params }),

    // Late Arrivals & Early Departures
    getLateArrivals: (params = {}) => api.get('/attendance/late-arrivals', { params }),
    getEarlyDepartures: (params = {}) => api.get('/attendance/early-departures', { params }),

    // Overtime
    getOvertime: (params = {}) => api.get('/attendance/overtime', { params }),
    approveOvertime: (id) => api.post(`/attendance/overtime/${id}/approve`),
    rejectOvertime: (id, reason) => api.post(`/attendance/overtime/${id}/reject`, { reason }),

    // Shifts
    getShifts: () => api.get('/attendance/shifts'),
    getShift: (id) => api.get(`/attendance/shifts/${id}`),
    createShift: (data) => api.post('/attendance/shifts', data),
    updateShift: (id, data) => api.put(`/attendance/shifts/${id}`, data),
    deleteShift: (id) => api.delete(`/attendance/shifts/${id}`),
    assignShift: (employeeId, shiftId) => api.post('/attendance/shifts/assign', { employee_id: employeeId, shift_id: shiftId }),

    // Settings
    getSettings: () => api.get('/attendance/settings'),
    updateSettings: (data) => api.put('/attendance/settings', data),
};
