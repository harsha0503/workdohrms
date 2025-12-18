import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Video, MapPin, Users, Clock, Calendar, CalendarDays, CheckCircle, Play, FileText } from 'lucide-react';
import meetingService from '../services/meetingService';
import Modal from '../components/Modal';
import './Meetings.css';

export default function Meetings() {
    const [activeTab, setActiveTab] = useState('meetings');
    const [meetings, setMeetings] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [formData, setFormData] = useState({});
    const [viewMode, setViewMode] = useState('list');

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [typesRes, roomsRes, meetingsRes] = await Promise.all([
                meetingService.getMeetingTypes(),
                meetingService.getMeetingRooms(),
                meetingService.getMeetings()
            ]);
            setTypes(typesRes.data.data || []);
            setRooms(roomsRes.data.data || []);
            setMeetings(meetingsRes.data.data?.data || meetingsRes.data.data || []);
        } catch (error) {
            console.error('Error loading data:', error);
        }
        setLoading(false);
    };

    const openModal = (type, data = {}) => {
        setModalType(type);
        setFormData(data);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalType === 'meeting') {
                if (formData.id) {
                    await meetingService.updateMeeting(formData.id, formData);
                } else {
                    await meetingService.createMeeting(formData);
                }
            } else if (modalType === 'room') {
                if (formData.id) {
                    await meetingService.updateMeetingRoom(formData.id, formData);
                } else {
                    await meetingService.createMeetingRoom(formData);
                }
            } else if (modalType === 'type') {
                if (formData.id) {
                    await meetingService.updateMeetingType(formData.id, formData);
                } else {
                    await meetingService.createMeetingType(formData);
                }
            }
            setShowModal(false);
            loadData();
        } catch (error) {
            console.error('Error saving:', error);
        }
    };

    const handleDelete = async (type, id) => {
        if (!confirm('Are you sure?')) return;
        try {
            if (type === 'meeting') await meetingService.deleteMeeting(id);
            else if (type === 'room') await meetingService.deleteMeetingRoom(id);
            else if (type === 'type') await meetingService.deleteMeetingType(id);
            loadData();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleStart = async (id) => {
        try {
            await meetingService.startMeeting(id);
            loadData();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleComplete = async (id) => {
        try {
            await meetingService.completeMeeting(id);
            loadData();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            scheduled: 'badge-info',
            in_progress: 'badge-warning',
            completed: 'badge-success',
            cancelled: 'badge-danger',
        };
        return badges[status] || 'badge-secondary';
    };

    // Group meetings by date for calendar view
    const groupedMeetings = meetings.reduce((acc, meeting) => {
        const date = meeting.date || meeting.start_time?.split(' ')[0];
        if (date) {
            if (!acc[date]) acc[date] = [];
            acc[date].push(meeting);
        }
        return acc;
    }, {});

    return (
        <div className="meetings-page">
            <div className="page-header">
                <div>
                    <h1>Meetings</h1>
                    <p className="breadcrumb">Meetings Management</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-secondary" onClick={() => openModal('type')}>
                        <Plus size={18} /> Add Type
                    </button>
                    <button className="btn btn-secondary" onClick={() => openModal('room')}>
                        <MapPin size={18} /> Add Room
                    </button>
                    <button className="btn btn-primary" onClick={() => openModal('meeting')}>
                        <Plus size={18} /> Schedule Meeting
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card blue">
                    <div className="stat-icon"><Video size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{meetings.length}</span>
                        <span className="stat-label">Total Meetings</span>
                    </div>
                </div>
                <div className="stat-card green">
                    <div className="stat-icon"><CheckCircle size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{meetings.filter(m => m.status === 'completed').length}</span>
                        <span className="stat-label">Completed</span>
                    </div>
                </div>
                <div className="stat-card orange">
                    <div className="stat-icon"><Clock size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{meetings.filter(m => m.status === 'scheduled').length}</span>
                        <span className="stat-label">Upcoming</span>
                    </div>
                </div>
                <div className="stat-card purple">
                    <div className="stat-icon"><MapPin size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{rooms.length}</span>
                        <span className="stat-label">Meeting Rooms</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs-row">
                <div className="tabs">
                    <button className={`tab ${activeTab === 'meetings' ? 'active' : ''}`} onClick={() => setActiveTab('meetings')}>
                        <Video size={18} /> Meetings
                    </button>
                    <button className={`tab ${activeTab === 'rooms' ? 'active' : ''}`} onClick={() => setActiveTab('rooms')}>
                        <MapPin size={18} /> Rooms
                    </button>
                    <button className={`tab ${activeTab === 'types' ? 'active' : ''}`} onClick={() => setActiveTab('types')}>
                        <Calendar size={18} /> Types
                    </button>
                </div>
                {activeTab === 'meetings' && (
                    <div className="view-toggle">
                        <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
                            <FileText size={16} />
                        </button>
                        <button className={`view-btn ${viewMode === 'calendar' ? 'active' : ''}`} onClick={() => setViewMode('calendar')}>
                            <CalendarDays size={16} />
                        </button>
                    </div>
                )}
            </div>

            {/* Content */}
            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <>
                    {activeTab === 'meetings' && viewMode === 'list' && (
                        <div className="meetings-list">
                            {meetings.length === 0 ? (
                                <div className="empty-state">
                                    <Video size={48} />
                                    <h3>No Meetings Scheduled</h3>
                                    <p>Schedule your first meeting to get started.</p>
                                </div>
                            ) : (
                                meetings.map(meeting => (
                                    <div key={meeting.id} className="meeting-card">
                                        <div className="meeting-datetime">
                                            <span className="date">{new Date(meeting.date || meeting.start_time).toLocaleDateString('en', { day: '2-digit', month: 'short' })}</span>
                                            <span className="time">{meeting.start_time_only || new Date(meeting.start_time).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className="meeting-info">
                                            <h4>{meeting.title}</h4>
                                            <div className="meeting-meta">
                                                {meeting.meeting_room && (
                                                    <span><MapPin size={14} /> {meeting.meeting_room.name}</span>
                                                )}
                                                {meeting.meeting_type && (
                                                    <span><Calendar size={14} /> {meeting.meeting_type.name}</span>
                                                )}
                                                <span><Users size={14} /> {meeting.attendees_count || 0} attendees</span>
                                            </div>
                                        </div>
                                        <div className="meeting-status">
                                            <span className={`badge ${getStatusBadge(meeting.status)}`}>{meeting.status?.replace('_', ' ')}</span>
                                        </div>
                                        <div className="meeting-actions">
                                            {meeting.status === 'scheduled' && (
                                                <button className="btn btn-sm btn-success" onClick={() => handleStart(meeting.id)} title="Start">
                                                    <Play size={14} />
                                                </button>
                                            )}
                                            {meeting.status === 'in_progress' && (
                                                <button className="btn btn-sm btn-warning" onClick={() => handleComplete(meeting.id)} title="Complete">
                                                    <CheckCircle size={14} />
                                                </button>
                                            )}
                                            <button className="btn btn-sm" onClick={() => openModal('meeting', meeting)}><Edit size={14} /></button>
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete('meeting', meeting.id)}><Trash2 size={14} /></button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'meetings' && viewMode === 'calendar' && (
                        <div className="card">
                            <div className="card-header">
                                <h5>Meeting Calendar</h5>
                            </div>
                            <div className="card-body calendar-view">
                                {Object.keys(groupedMeetings).length === 0 ? (
                                    <div className="empty-state">
                                        <CalendarDays size={48} />
                                        <h3>No meetings to display</h3>
                                    </div>
                                ) : (
                                    Object.entries(groupedMeetings).sort((a, b) => new Date(a[0]) - new Date(b[0])).map(([date, dayMeetings]) => (
                                        <div key={date} className="calendar-day">
                                            <div className="calendar-date">
                                                <span className="day-name">{new Date(date).toLocaleDateString('en', { weekday: 'short' })}</span>
                                                <span className="day-number">{new Date(date).getDate()}</span>
                                                <span className="month">{new Date(date).toLocaleDateString('en', { month: 'short' })}</span>
                                            </div>
                                            <div className="calendar-events">
                                                {dayMeetings.map(meeting => (
                                                    <div key={meeting.id} className={`calendar-event ${meeting.status}`}>
                                                        <span className="event-time">{meeting.start_time_only || '09:00'}</span>
                                                        <span className="event-title">{meeting.title}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'rooms' && (
                        <div className="rooms-grid">
                            {rooms.map(room => (
                                <div key={room.id} className="room-card">
                                    <div className="room-icon"><MapPin size={32} /></div>
                                    <h3>{room.name}</h3>
                                    <p>{room.location || 'No location specified'}</p>
                                    <div className="room-capacity">
                                        <Users size={16} /> Capacity: {room.capacity || 'N/A'}
                                    </div>
                                    <div className="room-amenities">
                                        {room.has_projector && <span className="amenity">Projector</span>}
                                        {room.has_whiteboard && <span className="amenity">Whiteboard</span>}
                                        {room.has_video_conf && <span className="amenity">Video Conf</span>}
                                    </div>
                                    <div className="card-actions">
                                        <button className="btn btn-sm" onClick={() => openModal('room', room)}><Edit size={14} /></button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete('room', room.id)}><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'types' && (
                        <div className="types-grid">
                            {types.map(type => (
                                <div key={type.id} className="type-card">
                                    <div className="type-icon"><Calendar size={24} /></div>
                                    <h3>{type.name}</h3>
                                    <p>{type.description || 'No description'}</p>
                                    <span className={`badge ${type.is_active ? 'badge-success' : 'badge-secondary'}`}>
                                        {type.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                    <div className="card-actions">
                                        <button className="btn btn-sm" onClick={() => openModal('type', type)}><Edit size={14} /></button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete('type', type.id)}><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={`${formData.id ? 'Edit' : 'Add'} ${modalType}`}>
                <form onSubmit={handleSubmit}>
                    {modalType === 'type' && (
                        <>
                            <div className="form-group">
                                <label>Type Name *</label>
                                <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3}></textarea>
                            </div>
                        </>
                    )}
                    {modalType === 'room' && (
                        <>
                            <div className="form-group">
                                <label>Room Name *</label>
                                <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Location</label>
                                    <input type="text" value={formData.location || ''} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Capacity</label>
                                    <input type="number" value={formData.capacity || ''} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Amenities</label>
                                <div className="checkbox-group">
                                    <label><input type="checkbox" checked={formData.has_projector || false} onChange={(e) => setFormData({ ...formData, has_projector: e.target.checked })} /> Projector</label>
                                    <label><input type="checkbox" checked={formData.has_whiteboard || false} onChange={(e) => setFormData({ ...formData, has_whiteboard: e.target.checked })} /> Whiteboard</label>
                                    <label><input type="checkbox" checked={formData.has_video_conf || false} onChange={(e) => setFormData({ ...formData, has_video_conf: e.target.checked })} /> Video Conference</label>
                                </div>
                            </div>
                        </>
                    )}
                    {modalType === 'meeting' && (
                        <>
                            <div className="form-group">
                                <label>Meeting Title *</label>
                                <input type="text" value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Meeting Type</label>
                                    <select value={formData.meeting_type_id || ''} onChange={(e) => setFormData({ ...formData, meeting_type_id: e.target.value })}>
                                        <option value="">Select Type</option>
                                        {types.map(type => (
                                            <option key={type.id} value={type.id}>{type.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Meeting Room</label>
                                    <select value={formData.meeting_room_id || ''} onChange={(e) => setFormData({ ...formData, meeting_room_id: e.target.value })}>
                                        <option value="">Select Room</option>
                                        {rooms.map(room => (
                                            <option key={room.id} value={room.id}>{room.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Date *</label>
                                    <input type="date" value={formData.date || ''} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Start Time *</label>
                                    <input type="time" value={formData.start_time_only || ''} onChange={(e) => setFormData({ ...formData, start_time_only: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>End Time</label>
                                    <input type="time" value={formData.end_time_only || ''} onChange={(e) => setFormData({ ...formData, end_time_only: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3}></textarea>
                            </div>
                        </>
                    )}
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
