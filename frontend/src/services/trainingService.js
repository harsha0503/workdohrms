import api from './api';

export const trainingService = {
    // Training Types
    getTrainingTypes: () => api.get('/training-types'),
    createTrainingType: (data) => api.post('/training-types', data),
    updateTrainingType: (id, data) => api.put(`/training-types/${id}`, data),
    deleteTrainingType: (id) => api.delete(`/training-types/${id}`),

    // Training Programs
    getPrograms: (params) => api.get('/training-programs', { params }),
    getProgram: (id) => api.get(`/training-programs/${id}`),
    createProgram: (data) => api.post('/training-programs', data),
    updateProgram: (id, data) => api.put(`/training-programs/${id}`, data),
    deleteProgram: (id) => api.delete(`/training-programs/${id}`),
    getActivePrograms: () => api.get('/training-programs/active'),

    // Training Sessions
    getSessions: (params) => api.get('/training-sessions', { params }),
    getSession: (id) => api.get(`/training-sessions/${id}`),
    createSession: (data) => api.post('/training-sessions', data),
    updateSession: (id, data) => api.put(`/training-sessions/${id}`, data),
    deleteSession: (id) => api.delete(`/training-sessions/${id}`),
    enrollEmployee: (sessionId, data) => api.post(`/training-sessions/${sessionId}/enroll`, data),
    getParticipants: (sessionId) => api.get(`/training-sessions/${sessionId}/participants`),
    completeEnrollment: (sessionId, data) => api.post(`/training-sessions/${sessionId}/complete-enrollment`, data),
    getUpcomingSessions: () => api.get('/training-sessions/upcoming'),
};

export default trainingService;
