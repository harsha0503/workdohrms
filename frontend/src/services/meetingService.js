import api from './api';

export const meetingService = {
    // Meeting Types
    getMeetingTypes: () => api.get('/meeting-types'),
    createMeetingType: (data) => api.post('/meeting-types', data),
    updateMeetingType: (id, data) => api.put(`/meeting-types/${id}`, data),
    deleteMeetingType: (id) => api.delete(`/meeting-types/${id}`),

    // Meeting Rooms
    getMeetingRooms: () => api.get('/meeting-rooms'),
    createMeetingRoom: (data) => api.post('/meeting-rooms', data),
    updateMeetingRoom: (id, data) => api.put(`/meeting-rooms/${id}`, data),
    deleteMeetingRoom: (id) => api.delete(`/meeting-rooms/${id}`),
    getAvailableRooms: (params) => api.get('/meeting-rooms-available', { params }),

    // Meetings
    getMeetings: (params) => api.get('/meetings', { params }),
    getMeeting: (id) => api.get(`/meetings/${id}`),
    createMeeting: (data) => api.post('/meetings', data),
    updateMeeting: (id, data) => api.put(`/meetings/${id}`, data),
    deleteMeeting: (id) => api.delete(`/meetings/${id}`),
    addAttendees: (id, data) => api.post(`/meetings/${id}/attendees`, data),
    startMeeting: (id) => api.post(`/meetings/${id}/start`),
    completeMeeting: (id) => api.post(`/meetings/${id}/complete`),
    addMinutes: (id, data) => api.post(`/meetings/${id}/minutes`, data),
    addActionItem: (id, data) => api.post(`/meetings/${id}/action-items`, data),
    completeActionItem: (actionItemId) => api.post(`/meeting-action-items/${actionItemId}/complete`),
    getCalendar: (params) => api.get('/meetings-calendar', { params }),
    getMyMeetings: () => api.get('/my-meetings'),
};

export default meetingService;
