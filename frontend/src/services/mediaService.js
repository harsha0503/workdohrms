import api from './api';

export const mediaService = {
    // Media Files
    getFiles: (params) => api.get('/media-files', { params }),
    getFile: (id) => api.get(`/media-files/${id}`),
    uploadFile: (formData) => api.post('/media-files', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    updateFile: (id, data) => api.put(`/media-files/${id}`, data),
    deleteFile: (id) => api.delete(`/media-files/${id}`),
    downloadFile: (id) => api.get(`/media-files/${id}/download`, { responseType: 'blob' }),

    // Directories/Folders
    getDirectories: () => api.get('/media-directories'),
    createDirectory: (data) => api.post('/media-directories', data),
    updateDirectory: (id, data) => api.put(`/media-directories/${id}`, data),
    deleteDirectory: (id) => api.delete(`/media-directories/${id}`),

    // File categories
    getCategories: () => api.get('/media-categories'),
    createCategory: (data) => api.post('/media-categories', data),
    deleteCategory: (id) => api.delete(`/media-categories/${id}`),
};

export default mediaService;
