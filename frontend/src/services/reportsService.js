import api from './api';

export const reportsService = {
    // Dashboard Stats
    getDashboardStats: () => api.get('/dashboard'),

    // Employee Reports
    getEmployeeReport: (params = {}) => api.get('/reports/employees', { params }),
    getEmployeeSummary: (params = {}) => api.get('/reports/employees/summary', { params }),
    getEmployeeByDepartment: () => api.get('/reports/employees/by-department'),
    getEmployeeByDesignation: () => api.get('/reports/employees/by-designation'),
    getEmployeeTurnover: (params = {}) => api.get('/reports/employees/turnover', { params }),
    getNewHires: (params = {}) => api.get('/reports/employees/new-hires', { params }),

    // Attendance Reports
    getAttendanceReport: (params = {}) => api.get('/reports/attendance', { params }),
    getAttendanceSummary: (params = {}) => api.get('/reports/attendance/summary', { params }),
    getDailyAttendance: (date) => api.get('/reports/attendance/daily', { params: { date } }),
    getMonthlyAttendance: (month, year) => api.get('/reports/attendance/monthly', { params: { month, year } }),
    getAttendanceByEmployee: (employeeId, params = {}) => api.get(`/reports/attendance/employee/${employeeId}`, { params }),
    getAttendanceByDepartment: (params = {}) => api.get('/reports/attendance/by-department', { params }),
    getLateArrivals: (params = {}) => api.get('/reports/attendance/late-arrivals', { params }),
    getEarlyDepartures: (params = {}) => api.get('/reports/attendance/early-departures', { params }),
    getAttendanceTrend: (params = {}) => api.get('/reports/attendance/trend', { params }),

    // Leave Reports
    getLeaveReport: (params = {}) => api.get('/reports/leave', { params }),
    getLeaveSummary: (params = {}) => api.get('/reports/leave/summary', { params }),
    getLeaveByType: (params = {}) => api.get('/reports/leave/by-type', { params }),
    getLeaveByDepartment: (params = {}) => api.get('/reports/leave/by-department', { params }),
    getLeaveBalance: (params = {}) => api.get('/reports/leave/balance', { params }),
    getLeaveByEmployee: (employeeId, params = {}) => api.get(`/reports/leave/employee/${employeeId}`, { params }),
    getLeaveCalendar: (month, year) => api.get('/reports/leave/calendar', { params: { month, year } }),

    // Payroll Reports
    getPayrollReport: (params = {}) => api.get('/reports/payroll', { params }),
    getPayrollSummary: (params = {}) => api.get('/reports/payroll/summary', { params }),
    getPayrollByDepartment: (params = {}) => api.get('/reports/payroll/by-department', { params }),
    getPayrollByMonth: (month, year) => api.get('/reports/payroll/monthly', { params: { month, year } }),
    getPayrollTrend: (params = {}) => api.get('/reports/payroll/trend', { params }),
    getSalaryComponents: (params = {}) => api.get('/reports/payroll/components', { params }),
    getTaxReport: (params = {}) => api.get('/reports/payroll/tax', { params }),

    // Performance Reports
    getPerformanceReport: (params = {}) => api.get('/reports/performance', { params }),
    getAppraisalReport: (params = {}) => api.get('/reports/performance/appraisals', { params }),
    getGoalReport: (params = {}) => api.get('/reports/performance/goals', { params }),

    // Project Reports
    getProjectReport: (params = {}) => api.get('/reports/projects', { params }),
    getProjectTimeline: (projectId) => api.get(`/reports/projects/${projectId}/timeline`),
    getTaskCompletionReport: (params = {}) => api.get('/reports/projects/tasks', { params }),
    getTimeLogReport: (params = {}) => api.get('/reports/projects/time-logs', { params }),

    // Training Reports
    getTrainingReport: (params = {}) => api.get('/reports/training', { params }),
    getTrainingCompletion: (params = {}) => api.get('/reports/training/completion', { params }),

    // Asset Reports
    getAssetReport: (params = {}) => api.get('/reports/assets', { params }),
    getAssetAllocation: () => api.get('/reports/assets/allocation'),

    // Recruitment Reports
    getRecruitmentReport: (params = {}) => api.get('/reports/recruitment', { params }),
    getHiringPipeline: (params = {}) => api.get('/reports/recruitment/pipeline', { params }),

    // Export Reports
    exportReport: (reportType, params = {}) => api.get(`/reports/${reportType}/export`, {
        params,
        responseType: 'blob'
    }),

    exportAttendanceReport: (params = {}) => api.get('/reports/attendance/export', {
        params,
        responseType: 'blob'
    }),

    exportLeaveReport: (params = {}) => api.get('/reports/leave/export', {
        params,
        responseType: 'blob'
    }),

    exportPayrollReport: (params = {}) => api.get('/reports/payroll/export', {
        params,
        responseType: 'blob'
    }),

    exportEmployeeReport: (params = {}) => api.get('/reports/employees/export', {
        params,
        responseType: 'blob'
    }),

    // Custom Reports
    getCustomReportFields: () => api.get('/reports/custom/fields'),
    generateCustomReport: (config) => api.post('/reports/custom/generate', config),
    saveCustomReportTemplate: (template) => api.post('/reports/custom/templates', template),
    getCustomReportTemplates: () => api.get('/reports/custom/templates'),
    deleteCustomReportTemplate: (id) => api.delete(`/reports/custom/templates/${id}`),
};
