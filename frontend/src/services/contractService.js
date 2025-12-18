import api from './api';

export const contractService = {
    // Contract Types
    getContractTypes: () => api.get('/contract-types'),
    createContractType: (data) => api.post('/contract-types', data),
    updateContractType: (id, data) => api.put(`/contract-types/${id}`, data),
    deleteContractType: (id) => api.delete(`/contract-types/${id}`),

    // Contracts
    getContracts: (params) => api.get('/contracts', { params }),
    getContract: (id) => api.get(`/contracts/${id}`),
    createContract: (data) => api.post('/contracts', data),
    updateContract: (id, data) => api.put(`/contracts/${id}`, data),
    deleteContract: (id) => api.delete(`/contracts/${id}`),
    renewContract: (id, data) => api.post(`/contracts/${id}/renew`, data),
    terminateContract: (id, data) => api.post(`/contracts/${id}/terminate`, data),
    getExpiringContracts: () => api.get('/contracts-expiring'),
    getEmployeeContracts: (employeeId) => api.get(`/contracts/employee/${employeeId}`),
};

export default contractService;
