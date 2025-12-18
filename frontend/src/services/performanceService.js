import api from './api';

export const performanceService = {
    // Performance Indicators
    getIndicators: (params) => api.get('/performance-indicators', { params }),
    getIndicator: (id) => api.get(`/performance-indicators/${id}`),
    createIndicator: (data) => api.post('/performance-indicators', data),
    updateIndicator: (id, data) => api.put(`/performance-indicators/${id}`, data),
    deleteIndicator: (id) => api.delete(`/performance-indicators/${id}`),

    // Appraisals
    getAppraisals: (params) => api.get('/appraisals', { params }),
    getAppraisal: (id) => api.get(`/appraisals/${id}`),
    createAppraisal: (data) => api.post('/appraisals', data),
    updateAppraisal: (id, data) => api.put(`/appraisals/${id}`, data),
    deleteAppraisal: (id) => api.delete(`/appraisals/${id}`),
    submitAppraisal: (id) => api.post(`/appraisals/${id}/submit`),
    approveAppraisal: (id) => api.post(`/appraisals/${id}/approve`),
    rejectAppraisal: (id, reason) => api.post(`/appraisals/${id}/reject`, { reason }),

    // Goals
    getGoals: (params) => api.get('/goals', { params }),
    getGoal: (id) => api.get(`/goals/${id}`),
    createGoal: (data) => api.post('/goals', data),
    updateGoal: (id, data) => api.put(`/goals/${id}`, data),
    deleteGoal: (id) => api.delete(`/goals/${id}`),
    updateGoalProgress: (id, progress) => api.post(`/goals/${id}/progress`, { progress }),

    // Goal Types
    getGoalTypes: () => api.get('/goal-types'),
    createGoalType: (data) => api.post('/goal-types', data),
    updateGoalType: (id, data) => api.put(`/goal-types/${id}`, data),
    deleteGoalType: (id) => api.delete(`/goal-types/${id}`),

    // Competencies
    getCompetencies: () => api.get('/competencies'),
    createCompetency: (data) => api.post('/competencies', data),
    updateCompetency: (id, data) => api.put(`/competencies/${id}`, data),
    deleteCompetency: (id) => api.delete(`/competencies/${id}`),
};

export default performanceService;
