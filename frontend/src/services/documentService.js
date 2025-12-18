import api from './api';

export const documentService = {
    // Document Categories
    getCategories: () => api.get('/document-categories'),
    createCategory: (data) => api.post('/document-categories', data),
    updateCategory: (id, data) => api.put(`/document-categories/${id}`, data),
    deleteCategory: (id) => api.delete(`/document-categories/${id}`),

    // HR Documents
    getDocuments: (params) => api.get('/hr-documents', { params }),
    getDocument: (id) => api.get(`/hr-documents/${id}`),
    uploadDocument: (formData) => api.post('/hr-documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    updateDocument: (id, data) => api.put(`/hr-documents/${id}`, data),
    deleteDocument: (id) => api.delete(`/hr-documents/${id}`),
    downloadDocument: (id) => api.get(`/hr-documents/${id}/download`, { responseType: 'blob' }),
    acknowledgeDocument: (id, notes) => api.post(`/hr-documents/${id}/acknowledge`, { notes }),
    getAcknowledgments: (id) => api.get(`/hr-documents/${id}/acknowledgments`),
    getPendingAcknowledgments: () => api.get('/pending-acknowledgments'),

    // Media Library
    getDirectories: (parentId) => api.get('/media-directories', { params: { parent_id: parentId } }),
    createDirectory: (data) => api.post('/media-directories', data),
    updateDirectory: (id, data) => api.put(`/media-directories/${id}`, data),
    deleteDirectory: (id) => api.delete(`/media-directories/${id}`),
    moveDirectory: (id, parentId) => api.post(`/media-directories/${id}/move`, { parent_id: parentId }),

    getFiles: (params) => api.get('/media-files', { params }),
    uploadFiles: (formData) => api.post('/media-files', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    deleteFile: (id) => api.delete(`/media-files/${id}`),
    downloadFile: (id) => api.get(`/media-files/${id}/download`, { responseType: 'blob' }),
    moveFile: (id, directoryId) => api.post(`/media-files/${id}/move`, { directory_id: directoryId }),
    shareFile: (id, userIds) => api.post(`/media-files/${id}/share`, { shared_with: userIds }),
};

export default documentService;
