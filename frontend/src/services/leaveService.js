import api from './api';

export const leaveService = {
    // Leave Requests
    getRequests: (params = {}) => api.get('/leave-requests', { params }),
    getRequest: (id) => api.get(`/leave-requests/${id}`),
    createRequest: (data) => api.post('/leave-requests', data),
    updateRequest: (id, data) => api.put(`/leave-requests/${id}`, data),
    deleteRequest: (id) => api.delete(`/leave-requests/${id}`),
    cancelRequest: (id) => api.post(`/leave-requests/${id}/cancel`),

    // My Leave
    getMyRequests: (params = {}) => api.get('/leave-requests/my', { params }),
    getMyLeaveBalance: () => api.get('/leave-requests/my-balance'),

    // Leave Approval
    processRequest: (id, status, remarks) => api.put(`/leave-requests/${id}`, {
        approval_status: status,
        remarks
    }),
    approveRequest: (id, remarks = '') => api.post(`/leave-requests/${id}/approve`, { remarks }),
    rejectRequest: (id, remarks) => api.post(`/leave-requests/${id}/reject`, { remarks }),

    // Leave Balance
    getLeaveBalance: (employeeId) => api.get(`/staff-members/${employeeId}/leave-balance`),
    getAllLeaveBalances: (params = {}) => api.get('/leave-balance', { params }),
    updateLeaveBalance: (employeeId, data) => api.put(`/staff-members/${employeeId}/leave-balance`, data),
    resetLeaveBalance: (employeeId) => api.post(`/staff-members/${employeeId}/leave-balance/reset`),

    // Leave Types
    getLeaveTypes: () => api.get('/leave-types'),
    getLeaveType: (id) => api.get(`/leave-types/${id}`),
    createLeaveType: (data) => api.post('/leave-types', data),
    updateLeaveType: (id, data) => api.put(`/leave-types/${id}`, data),
    deleteLeaveType: (id) => api.delete(`/leave-types/${id}`),

    // Leave Calendar
    getLeaveCalendar: (month, year) => api.get('/leave-requests/calendar', { params: { month, year } }),
    getTeamLeaveCalendar: (month, year) => api.get('/leave-requests/team-calendar', { params: { month, year } }),

    // Statistics
    getLeaveStats: (params = {}) => api.get('/leave-requests/stats', { params }),
    getLeaveStatsByDepartment: (params = {}) => api.get('/leave-requests/stats/department', { params }),
    getLeaveStatsByType: (params = {}) => api.get('/leave-requests/stats/type', { params }),

    // Reports
    getLeaveReport: (params = {}) => api.get('/reports/leave', { params }),
    exportLeaveReport: (params = {}) => api.get('/reports/leave/export', {
        params,
        responseType: 'blob'
    }),

    // Carry Forward
    processCarryForward: () => api.post('/leave-requests/carry-forward'),
    getCarryForwardSettings: () => api.get('/leave-requests/carry-forward/settings'),

    // Policies
    getLeavePolicy: () => api.get('/leave-policy'),
    updateLeavePolicy: (data) => api.put('/leave-policy', data),
};
