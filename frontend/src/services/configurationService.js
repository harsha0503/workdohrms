import api from './api';

export const configurationService = {
    // Leave Types
    getLeaveTypes: () => api.get('/leave-types'),
    createLeaveType: (data) => api.post('/leave-types', data),
    updateLeaveType: (id, data) => api.put(`/leave-types/${id}`, data),
    deleteLeaveType: (id) => api.delete(`/leave-types/${id}`),

    // Award Types
    getAwardTypes: () => api.get('/award-types'),
    createAwardType: (data) => api.post('/award-types', data),
    updateAwardType: (id, data) => api.put(`/award-types/${id}`, data),
    deleteAwardType: (id) => api.delete(`/award-types/${id}`),

    // Termination Types
    getTerminationTypes: () => api.get('/termination-types'),
    createTerminationType: (data) => api.post('/termination-types', data),
    updateTerminationType: (id, data) => api.put(`/termination-types/${id}`, data),
    deleteTerminationType: (id) => api.delete(`/termination-types/${id}`),

    // Document Types
    getDocumentTypes: () => api.get('/document-types'),
    createDocumentType: (data) => api.post('/document-types', data),
    updateDocumentType: (id, data) => api.put(`/document-types/${id}`, data),
    deleteDocumentType: (id) => api.delete(`/document-types/${id}`),

    // Warning Types
    getWarningTypes: () => api.get('/warning-types'),
    createWarningType: (data) => api.post('/warning-types', data),
    updateWarningType: (id, data) => api.put(`/warning-types/${id}`, data),
    deleteWarningType: (id) => api.delete(`/warning-types/${id}`),

    // Complaint Types
    getComplaintTypes: () => api.get('/complaint-types'),
    createComplaintType: (data) => api.post('/complaint-types', data),
    updateComplaintType: (id, data) => api.put(`/complaint-types/${id}`, data),
    deleteComplaintType: (id) => api.delete(`/complaint-types/${id}`),

    // Travel Types
    getTravelTypes: () => api.get('/travel-types'),
    createTravelType: (data) => api.post('/travel-types', data),
    updateTravelType: (id, data) => api.put(`/travel-types/${id}`, data),
    deleteTravelType: (id) => api.delete(`/travel-types/${id}`),

    // Expense Types
    getExpenseTypes: () => api.get('/expense-types'),
    createExpenseType: (data) => api.post('/expense-types', data),
    updateExpenseType: (id, data) => api.put(`/expense-types/${id}`, data),
    deleteExpenseType: (id) => api.delete(`/expense-types/${id}`),

    // Training Types
    getTrainingTypes: () => api.get('/training-types'),
    createTrainingType: (data) => api.post('/training-types', data),
    updateTrainingType: (id, data) => api.put(`/training-types/${id}`, data),
    deleteTrainingType: (id) => api.delete(`/training-types/${id}`),

    // IP Restriction
    getIPRestrictions: () => api.get('/ip-restrictions'),
    createIPRestriction: (data) => api.post('/ip-restrictions', data),
    deleteIPRestriction: (id) => api.delete(`/ip-restrictions/${id}`),
};
