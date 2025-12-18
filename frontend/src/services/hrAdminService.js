import api from './api';

export const hrAdminService = {
    // Awards
    getAwards: (params) => api.get('/awards', { params }),
    getAward: (id) => api.get(`/awards/${id}`),
    createAward: (data) => api.post('/awards', data),
    updateAward: (id, data) => api.put(`/awards/${id}`, data),
    deleteAward: (id) => api.delete(`/awards/${id}`),
    getAwardTypes: () => api.get('/award-types'),
    createAwardType: (data) => api.post('/award-types', data),
    updateAwardType: (id, data) => api.put(`/award-types/${id}`, data),
    deleteAwardType: (id) => api.delete(`/award-types/${id}`),

    // Transfers
    getTransfers: (params) => api.get('/transfers', { params }),
    getTransfer: (id) => api.get(`/transfers/${id}`),
    createTransfer: (data) => api.post('/transfers', data),
    updateTransfer: (id, data) => api.put(`/transfers/${id}`, data),
    deleteTransfer: (id) => api.delete(`/transfers/${id}`),
    approveTransfer: (id) => api.post(`/transfers/${id}/approve`),
    rejectTransfer: (id, reason) => api.post(`/transfers/${id}/reject`, { rejection_reason: reason }),

    // Resignations
    getResignations: (params) => api.get('/resignations', { params }),
    getResignation: (id) => api.get(`/resignations/${id}`),
    createResignation: (data) => api.post('/resignations', data),
    updateResignation: (id, data) => api.put(`/resignations/${id}`, data),
    deleteResignation: (id) => api.delete(`/resignations/${id}`),
    approveResignation: (id) => api.post(`/resignations/${id}/approve`),
    rejectResignation: (id, reason) => api.post(`/resignations/${id}/reject`, { rejection_reason: reason }),

    // Trips/Travel
    getTrips: (params) => api.get('/trips', { params }),
    getTrip: (id) => api.get(`/trips/${id}`),
    createTrip: (data) => api.post('/trips', data),
    updateTrip: (id, data) => api.put(`/trips/${id}`, data),
    deleteTrip: (id) => api.delete(`/trips/${id}`),
    approveTrip: (id) => api.post(`/trips/${id}/approve`),
    rejectTrip: (id, reason) => api.post(`/trips/${id}/reject`, { rejection_reason: reason }),

    // Promotions
    getPromotions: (params) => api.get('/promotions', { params }),
    getPromotion: (id) => api.get(`/promotions/${id}`),
    createPromotion: (data) => api.post('/promotions', data),
    updatePromotion: (id, data) => api.put(`/promotions/${id}`, data),
    deletePromotion: (id) => api.delete(`/promotions/${id}`),

    // Complaints
    getComplaints: (params) => api.get('/complaints', { params }),
    getComplaint: (id) => api.get(`/complaints/${id}`),
    createComplaint: (data) => api.post('/complaints', data),
    updateComplaint: (id, data) => api.put(`/complaints/${id}`, data),
    deleteComplaint: (id) => api.delete(`/complaints/${id}`),
    resolveComplaint: (id, resolution) => api.post(`/complaints/${id}/resolve`, { resolution }),

    // Warnings
    getWarnings: (params) => api.get('/warnings', { params }),
    getWarning: (id) => api.get(`/warnings/${id}`),
    createWarning: (data) => api.post('/warnings', data),
    updateWarning: (id, data) => api.put(`/warnings/${id}`, data),
    deleteWarning: (id) => api.delete(`/warnings/${id}`),

    // Terminations
    getTerminations: (params) => api.get('/terminations', { params }),
    getTermination: (id) => api.get(`/terminations/${id}`),
    createTermination: (data) => api.post('/terminations', data),
    updateTermination: (id, data) => api.put(`/terminations/${id}`, data),
    deleteTermination: (id) => api.delete(`/terminations/${id}`),
    getTerminationTypes: () => api.get('/termination-types'),
    createTerminationType: (data) => api.post('/termination-types', data),
    updateTerminationType: (id, data) => api.put(`/termination-types/${id}`, data),
    deleteTerminationType: (id) => api.delete(`/termination-types/${id}`),

    // Announcements
    getAnnouncements: (params) => api.get('/announcements', { params }),
    getAnnouncement: (id) => api.get(`/announcements/${id}`),
    createAnnouncement: (data) => api.post('/announcements', data),
    updateAnnouncement: (id, data) => api.put(`/announcements/${id}`, data),
    deleteAnnouncement: (id) => api.delete(`/announcements/${id}`),

    // Holidays
    getHolidays: (params) => api.get('/holidays', { params }),
    getHoliday: (id) => api.get(`/holidays/${id}`),
    createHoliday: (data) => api.post('/holidays', data),
    updateHoliday: (id, data) => api.put(`/holidays/${id}`, data),
    deleteHoliday: (id) => api.delete(`/holidays/${id}`),

    // Company Policy
    getPolicies: (params) => api.get('/company-policies', { params }),
    getPolicy: (id) => api.get(`/company-policies/${id}`),
    createPolicy: (data) => api.post('/company-policies', data),
    updatePolicy: (id, data) => api.put(`/company-policies/${id}`, data),
    deletePolicy: (id) => api.delete(`/company-policies/${id}`),
};

export default hrAdminService;
