import api from './api';

export const recruitmentService = {
    // Job Categories
    getJobCategories: () => api.get('/job-categories'),
    createJobCategory: (data) => api.post('/job-categories', data),
    updateJobCategory: (id, data) => api.put(`/job-categories/${id}`, data),
    deleteJobCategory: (id) => api.delete(`/job-categories/${id}`),

    // Job Stages
    getJobStages: () => api.get('/job-stages'),
    createJobStage: (data) => api.post('/job-stages', data),
    updateJobStage: (id, data) => api.put(`/job-stages/${id}`, data),
    deleteJobStage: (id) => api.delete(`/job-stages/${id}`),

    // Jobs
    getJobs: (params) => api.get('/jobs', { params }),
    getJob: (id) => api.get(`/jobs/${id}`),
    createJob: (data) => api.post('/jobs', data),
    updateJob: (id, data) => api.put(`/jobs/${id}`, data),
    deleteJob: (id) => api.delete(`/jobs/${id}`),
    publishJob: (id) => api.post(`/jobs/${id}/publish`),
    closeJob: (id) => api.post(`/jobs/${id}/close`),

    // Candidates
    getCandidates: (params) => api.get('/candidates', { params }),
    getCandidate: (id) => api.get(`/candidates/${id}`),
    createCandidate: (data) => api.post('/candidates', data),
    updateCandidate: (id, data) => api.put(`/candidates/${id}`, data),
    deleteCandidate: (id) => api.delete(`/candidates/${id}`),
    archiveCandidate: (id) => api.post(`/candidates/${id}/archive`),
    convertToEmployee: (id, data) => api.post(`/candidates/${id}/convert`, data),

    // Job Applications
    getApplications: (params) => api.get('/job-applications', { params }),
    getApplication: (id) => api.get(`/job-applications/${id}`),
    moveApplicationStage: (id, stageId) => api.post(`/job-applications/${id}/move-stage`, { stage_id: stageId }),
    rateApplication: (id, rating) => api.post(`/job-applications/${id}/rate`, { rating }),
    shortlistApplication: (id) => api.post(`/job-applications/${id}/shortlist`),
    rejectApplication: (id, reason) => api.post(`/job-applications/${id}/reject`, { reason }),
    hireApplication: (id) => api.post(`/job-applications/${id}/hire`),

    // Interviews
    getInterviews: (params) => api.get('/interview-schedules', { params }),
    createInterview: (data) => api.post('/interview-schedules', data),
    updateInterview: (id, data) => api.put(`/interview-schedules/${id}`, data),
    deleteInterview: (id) => api.delete(`/interview-schedules/${id}`),
    submitFeedback: (id, data) => api.post(`/interview-schedules/${id}/feedback`, data),
    getTodaysInterviews: () => api.get('/interviews/today'),

    // Job Requisitions
    getRequisitions: (params) => api.get('/job-requisitions', { params }),
    createRequisition: (data) => api.post('/job-requisitions', data),
    approveRequisition: (id) => api.post(`/job-requisitions/${id}/approve`),
    rejectRequisition: (id, reason) => api.post(`/job-requisitions/${id}/reject`, { rejection_reason: reason }),
    getPendingRequisitions: () => api.get('/job-requisitions-pending'),

    // Offers
    getOffers: (params) => api.get('/offers', { params }),
    createOffer: (data) => api.post('/offers', data),
    sendOffer: (id) => api.post(`/offers/${id}/send`),
    acceptOffer: (id) => api.post(`/offers/${id}/accept`),
    rejectOffer: (id, notes) => api.post(`/offers/${id}/reject`, { notes }),
    getOfferTemplates: () => api.get('/offer-templates'),
};

export default recruitmentService;
