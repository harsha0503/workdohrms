import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, BookOpen, Users, Calendar, Award, Clock } from 'lucide-react';
import trainingService from '../services/trainingService';
import Modal from '../components/Modal';
import './Training.css';

export default function Training() {
    const [activeTab, setActiveTab] = useState('programs');
    const [programs, setPrograms] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [formData, setFormData] = useState({});

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            const typesRes = await trainingService.getTrainingTypes();
            setTypes(typesRes.data.data || []);

            if (activeTab === 'programs') {
                const res = await trainingService.getPrograms();
                setPrograms(res.data.data?.data || res.data.data || []);
            } else if (activeTab === 'sessions') {
                const res = await trainingService.getSessions();
                setSessions(res.data.data?.data || res.data.data || []);
            }
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
            if (modalType === 'program') {
                if (formData.id) {
                    await trainingService.updateProgram(formData.id, formData);
                } else {
                    await trainingService.createProgram(formData);
                }
            } else if (modalType === 'session') {
                if (formData.id) {
                    await trainingService.updateSession(formData.id, formData);
                } else {
                    await trainingService.createSession(formData);
                }
            } else if (modalType === 'type') {
                if (formData.id) {
                    await trainingService.updateTrainingType(formData.id, formData);
                } else {
                    await trainingService.createTrainingType(formData);
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
            if (type === 'program') await trainingService.deleteProgram(id);
            else if (type === 'session') await trainingService.deleteSession(id);
            else if (type === 'type') await trainingService.deleteTrainingType(id);
            loadData();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="training-page">
            <div className="page-header">
                <div>
                    <h1>Training Management</h1>
                    <p>Manage training programs, sessions, and enrollments</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-secondary" onClick={() => openModal('type')}>
                        <Plus size={18} /> Add Type
                    </button>
                    <button className="btn btn-primary" onClick={() => openModal(activeTab === 'programs' ? 'program' : 'session')}>
                        <Plus size={18} /> Add {activeTab === 'programs' ? 'Program' : 'Session'}
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs">
                <button className={`tab ${activeTab === 'programs' ? 'active' : ''}`} onClick={() => setActiveTab('programs')}>
                    <BookOpen size={18} /> Programs
                </button>
                <button className={`tab ${activeTab === 'sessions' ? 'active' : ''}`} onClick={() => setActiveTab('sessions')}>
                    <Calendar size={18} /> Sessions
                </button>
            </div>

            {/* Stats */}
            <div className="stats-row">
                <div className="stat-card">
                    <BookOpen size={24} />
                    <div>
                        <span className="stat-value">{programs.length}</span>
                        <span className="stat-label">Programs</span>
                    </div>
                </div>
                <div className="stat-card">
                    <Calendar size={24} />
                    <div>
                        <span className="stat-value">{sessions.length}</span>
                        <span className="stat-label">Sessions</span>
                    </div>
                </div>
                <div className="stat-card">
                    <Award size={24} />
                    <div>
                        <span className="stat-value">{types.length}</span>
                        <span className="stat-label">Types</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <>
                    {activeTab === 'programs' && (
                        <div className="cards-grid">
                            {programs.length === 0 ? (
                                <div className="empty-state">
                                    <BookOpen size={48} />
                                    <h3>No Training Programs</h3>
                                    <p>Create your first training program to get started.</p>
                                </div>
                            ) : (
                                programs.map(program => (
                                    <div key={program.id} className="program-card">
                                        <div className="program-header">
                                            <h3>{program.name}</h3>
                                            <span className={`badge ${program.is_active ? 'badge-success' : 'badge-secondary'}`}>
                                                {program.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <p className="program-description">{program.description?.substring(0, 120)}...</p>
                                        <div className="program-meta">
                                            <span><Clock size={14} /> {program.duration_hours || 0} hours</span>
                                            <span><Users size={14} /> {program.participants_count || 0} participants</span>
                                        </div>
                                        <div className="program-type">
                                            Type: {program.training_type?.name || 'General'}
                                        </div>
                                        <div className="card-actions">
                                            <button className="btn btn-sm" onClick={() => openModal('program', program)}><Edit size={14} /></button>
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete('program', program.id)}><Trash2 size={14} /></button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'sessions' && (
                        <div className="sessions-list">
                            {sessions.length === 0 ? (
                                <div className="empty-state">
                                    <Calendar size={48} />
                                    <h3>No Training Sessions</h3>
                                    <p>Schedule training sessions for your programs.</p>
                                </div>
                            ) : (
                                sessions.map(session => (
                                    <div key={session.id} className="session-card">
                                        <div className="session-date">
                                            <span className="day">{new Date(session.start_date).getDate()}</span>
                                            <span className="month">{new Date(session.start_date).toLocaleDateString('en', { month: 'short' })}</span>
                                        </div>
                                        <div className="session-details">
                                            <h4>{session.program?.name || session.title || 'Training Session'}</h4>
                                            <p>{session.location || 'Online'}</p>
                                            <div className="session-meta">
                                                <span><Clock size={14} /> {session.start_time} - {session.end_time}</span>
                                                <span><Users size={14} /> {session.max_participants || 'Unlimited'} max</span>
                                            </div>
                                        </div>
                                        <div className="session-status">
                                            <span className={`badge ${session.status === 'completed' ? 'badge-success' : session.status === 'scheduled' ? 'badge-info' : 'badge-secondary'}`}>
                                                {session.status || 'Scheduled'}
                                            </span>
                                        </div>
                                        <div className="session-actions">
                                            <button className="btn btn-sm" onClick={() => openModal('session', session)}><Edit size={14} /></button>
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete('session', session.id)}><Trash2 size={14} /></button>
                                        </div>
                                    </div>
                                ))
                            )}
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
                                <label>Type Name</label>
                                <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3}></textarea>
                            </div>
                        </>
                    )}
                    {modalType === 'program' && (
                        <>
                            <div className="form-group">
                                <label>Program Name</label>
                                <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Training Type</label>
                                <select value={formData.training_type_id || ''} onChange={(e) => setFormData({ ...formData, training_type_id: e.target.value })}>
                                    <option value="">Select Type</option>
                                    {types.map(type => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Duration (hours)</label>
                                <input type="number" value={formData.duration_hours || ''} onChange={(e) => setFormData({ ...formData, duration_hours: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4}></textarea>
                            </div>
                        </>
                    )}
                    {modalType === 'session' && (
                        <>
                            <div className="form-group">
                                <label>Program</label>
                                <select value={formData.training_program_id || ''} onChange={(e) => setFormData({ ...formData, training_program_id: e.target.value })} required>
                                    <option value="">Select Program</option>
                                    {programs.map(prog => (
                                        <option key={prog.id} value={prog.id}>{prog.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Start Date</label>
                                    <input type="date" value={formData.start_date || ''} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>End Date</label>
                                    <input type="date" value={formData.end_date || ''} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Location</label>
                                <input type="text" value={formData.location || ''} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Max Participants</label>
                                <input type="number" value={formData.max_participants || ''} onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })} />
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
