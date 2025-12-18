import api from './api';

export const assetService = {
    // Asset Types
    getAssetTypes: () => api.get('/asset-types'),
    createAssetType: (data) => api.post('/asset-types', data),
    updateAssetType: (id, data) => api.put(`/asset-types/${id}`, data),
    deleteAssetType: (id) => api.delete(`/asset-types/${id}`),

    // Assets
    getAssets: (params) => api.get('/assets', { params }),
    getAsset: (id) => api.get(`/assets/${id}`),
    createAsset: (data) => api.post('/assets', data),
    updateAsset: (id, data) => api.put(`/assets/${id}`, data),
    deleteAsset: (id) => api.delete(`/assets/${id}`),
    assignAsset: (id, data) => api.post(`/assets/${id}/assign`, data),
    returnAsset: (id, data) => api.post(`/assets/${id}/return`, data),
    getAvailableAssets: () => api.get('/assets-available'),
    getEmployeeAssets: (employeeId) => api.get(`/assets/employee/${employeeId}`),
};

export default assetService;
