import api from './api';

export const projectService = {
    // Projects
    getProjects: (params = {}) => api.get('/projects', { params }),
    getProject: (id) => api.get(`/projects/${id}`),
    createProject: (data) => api.post('/projects', data),
    updateProject: (id, data) => api.put(`/projects/${id}`, data),
    deleteProject: (id) => api.delete(`/projects/${id}`),

    // Project Tasks
    getTasks: (projectId, params = {}) => api.get(`/projects/${projectId}/tasks`, { params }),
    getTask: (projectId, taskId) => api.get(`/projects/${projectId}/tasks/${taskId}`),
    createTask: (projectId, data) => api.post(`/projects/${projectId}/tasks`, data),
    updateTask: (projectId, taskId, data) => api.put(`/projects/${projectId}/tasks/${taskId}`, data),
    deleteTask: (projectId, taskId) => api.delete(`/projects/${projectId}/tasks/${taskId}`),
    updateTaskStatus: (projectId, taskId, status) => api.patch(`/projects/${projectId}/tasks/${taskId}/status`, { status }),

    // Task Comments
    getTaskComments: (projectId, taskId) => api.get(`/projects/${projectId}/tasks/${taskId}/comments`),
    addTaskComment: (projectId, taskId, data) => api.post(`/projects/${projectId}/tasks/${taskId}/comments`, data),

    // Project Members
    getProjectMembers: (projectId) => api.get(`/projects/${projectId}/members`),
    addProjectMember: (projectId, userId) => api.post(`/projects/${projectId}/members`, { user_id: userId }),
    removeProjectMember: (projectId, userId) => api.delete(`/projects/${projectId}/members/${userId}`),

    // Time Logs
    getTimeLogs: (projectId, params = {}) => api.get(`/projects/${projectId}/time-logs`, { params }),
    createTimeLog: (projectId, data) => api.post(`/projects/${projectId}/time-logs`, data),
    updateTimeLog: (projectId, logId, data) => api.put(`/projects/${projectId}/time-logs/${logId}`, data),
    deleteTimeLog: (projectId, logId) => api.delete(`/projects/${projectId}/time-logs/${logId}`),

    // Milestones
    getMilestones: (projectId) => api.get(`/projects/${projectId}/milestones`),
    createMilestone: (projectId, data) => api.post(`/projects/${projectId}/milestones`, data),
    updateMilestone: (projectId, milestoneId, data) => api.put(`/projects/${projectId}/milestones/${milestoneId}`, data),
    deleteMilestone: (projectId, milestoneId) => api.delete(`/projects/${projectId}/milestones/${milestoneId}`),

    // Project Files
    getProjectFiles: (projectId) => api.get(`/projects/${projectId}/files`),
    uploadProjectFile: (projectId, file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post(`/projects/${projectId}/files`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    deleteProjectFile: (projectId, fileId) => api.delete(`/projects/${projectId}/files/${fileId}`),

    // Gantt Data
    getGanttData: (projectId) => api.get(`/projects/${projectId}/gantt`),

    // Project Stats
    getProjectStats: (projectId) => api.get(`/projects/${projectId}/stats`),
};
