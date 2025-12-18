import api from './api';

export const onboardingService = {
    // Onboarding Templates
    getTemplates: () => api.get('/onboarding-templates'),
    getTemplate: (id) => api.get(`/onboarding-templates/${id}`),
    createTemplate: (data) => api.post('/onboarding-templates', data),
    updateTemplate: (id, data) => api.put(`/onboarding-templates/${id}`, data),
    deleteTemplate: (id) => api.delete(`/onboarding-templates/${id}`),
    addTask: (templateId, data) => api.post(`/onboarding-templates/${templateId}/tasks`, data),

    // Employee Onboardings
    getOnboardings: (params) => api.get('/employee-onboardings', { params }),
    getOnboarding: (id) => api.get(`/employee-onboardings/${id}`),
    assignOnboarding: (data) => api.post('/employee-onboardings', data),
    completeTask: (id, data) => api.post(`/employee-onboardings/${id}/complete-task`, data),
    getPendingOnboardings: () => api.get('/onboardings/pending'),
};

export default onboardingService;
