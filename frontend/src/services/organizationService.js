import api from './api';

export const organizationService = {
    // ===== Office Locations (Branches) =====
    getOfficeLocations: () => api.get('/office-locations'),
    getBranches: () => api.get('/office-locations'), // Alias for branches
    createOfficeLocation: (data) => api.post('/office-locations', data),
    createBranch: (data) => api.post('/office-locations', data),
    updateOfficeLocation: (id, data) => api.put(`/office-locations/${id}`, data),
    updateBranch: (id, data) => api.put(`/office-locations/${id}`, data),
    deleteOfficeLocation: (id) => api.delete(`/office-locations/${id}`),
    deleteBranch: (id) => api.delete(`/office-locations/${id}`),

    // ===== Divisions (Departments) =====
    getDivisions: () => api.get('/divisions'),
    getDepartments: () => api.get('/divisions'), // Alias for departments
    createDivision: (data) => api.post('/divisions', data),
    createDepartment: (data) => api.post('/divisions', data),
    updateDivision: (id, data) => api.put(`/divisions/${id}`, data),
    updateDepartment: (id, data) => api.put(`/divisions/${id}`, data),
    deleteDivision: (id) => api.delete(`/divisions/${id}`),
    deleteDepartment: (id) => api.delete(`/divisions/${id}`),
    fetchDivisionsByLocation: (locationId) => api.post('/fetch-divisions', { office_location_id: locationId }),
    fetchDepartmentsByBranch: (branchId) => api.post('/fetch-divisions', { office_location_id: branchId }),

    // ===== Job Titles (Designations) =====
    getJobTitles: () => api.get('/job-titles'),
    getDesignations: () => api.get('/job-titles'), // Alias for designations
    createJobTitle: (data) => api.post('/job-titles', data),
    createDesignation: (data) => api.post('/job-titles', data),
    updateJobTitle: (id, data) => api.put(`/job-titles/${id}`, data),
    updateDesignation: (id, data) => api.put(`/job-titles/${id}`, data),
    deleteJobTitle: (id) => api.delete(`/job-titles/${id}`),
    deleteDesignation: (id) => api.delete(`/job-titles/${id}`),
    fetchJobTitlesByDivision: (divisionId) => api.post('/fetch-job-titles', { division_id: divisionId }),
    fetchDesignationsByDepartment: (departmentId) => api.post('/fetch-job-titles', { division_id: departmentId }),

    // ===== Dashboard & Reports =====
    getDashboard: () => api.get('/dashboard'),
    getOrgChart: () => api.get('/staff-members-dropdown'),
};
