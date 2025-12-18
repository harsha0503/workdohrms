import { useState, useEffect } from 'react';
import {
    Megaphone, Plus, Edit2, Trash2, Eye, Send, Users, Building, Filter, Search, Calendar
} from 'lucide-react';
import { announcementService } from '../services/announcementService';
import Modal from '../components/Modal';
import './Announcements.css';

export default function Announcements() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        target_type: 'all', // all, department, employee
        department_ids: [],
        employee_ids: [],
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [annRes, deptRes, empRes] = await Promise.all([
                announcementService.getAnnouncements(),
                announcementService.getDepartments?.() || Promise.resolve({ data: [] }),
                announcementService.getEmployees?.() || Promise.resolve({ data: [] })
            ]);
            setAnnouncements(annRes.data.data || annRes.data || []);
            setDepartments(deptRes.data.data || deptRes.data || []);
            setEmployees(empRes.data.data?.data || empRes.data.data || empRes.data || []);
        } catch (error) {
            console.error('Error:', error);
            // Mock data
            setAnnouncements([
                {
                    id: 1,
                    title: 'Office Holiday Notice',
                    description: 'Office will be closed on December 25th for Christmas celebrations.',
                    start_date: '2024-12-20',
                    end_date: '2024-12-26',
                    created_at: '2024-12-18',
                    target_type: 'all'
                },
                {
                    id: 2,
                    title: 'Quarterly Review Meeting',
                    description: 'All department heads are requested to attend the quarterly review meeting on January 5th.',
                    start_date: '2024-12-18',
                    end_date: '2025-01-05',
                    created_at: '2024-12-17',
                    target_type: 'department'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAnnouncement) {
                await announcementService.updateAnnouncement(editingAnnouncement.id, formData);
            } else {
                await announcementService.createAnnouncement(formData);
            }
            setShowModal(false);
            resetForm();
            loadData();
        } catch (error) {
            alert('Error saving announcement');
        }
    };

    const handleEdit = (announcement) => {
        setEditingAnnouncement(announcement);
        setFormData({
            title: announcement.title,
            description: announcement.description,
            start_date: announcement.start_date,
            end_date: announcement.end_date,
            target_type: announcement.target_type || 'all',
            department_ids: announcement.department_ids || [],
            employee_ids: announcement.employee_ids || [],
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this announcement?')) {
            try {
                await announcementService.deleteAnnouncement(id);
                loadData();
            } catch (error) {
                alert('Error deleting announcement');
            }
        }
    };

    const handleView = (announcement) => {
        setSelectedAnnouncement(announcement);
        setShowViewModal(true);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            start_date: '',
            end_date: '',
            target_type: 'all',
            department_ids: [],
            employee_ids: [],
        });
        setEditingAnnouncement(null);
    };

    const isActive = (announcement) => {
        const now = new Date().toISOString().split('T')[0];
        return announcement.start_date <= now && announcement.end_date >= now;
    };

    return (
        <div className="announcements-page">
            <div className="page-header">
                <div>
                    <h1>Announcements</h1>
                    <p className="breadcrumb">HR Admin &gt; Announcements</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
                        <Plus size={16} /> Create Announcement
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid mini">
                <div className="stat-card blue">
                    <div className="stat-icon"><Megaphone size={20} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{announcements.length}</span>
                        <span className="stat-label">Total Announcements</span>
                    </div>
                </div>
                <div className="stat-card green">
                    <div className="stat-icon"><Megaphone size={20} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{announcements.filter(a => isActive(a)).length}</span>
                        <span className="stat-label">Active</span>
                    </div>
                </div>
            </div>

            {/* Announcements List */}
            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <div className="announcements-grid">
                    {announcements.length === 0 ? (
                        <div className="empty-state">
                            <Megaphone size={48} />
                            <p>No announcements yet</p>
                            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                                Create First Announcement
                            </button>
                        </div>
                    ) : (
                        announcements.map(announcement => (
                            <div key={announcement.id} className={`announcement-card ${isActive(announcement) ? 'active' : 'expired'}`}>
                                <div className="announcement-header">
                                    <div className="announcement-icon">
                                        <Megaphone size={24} />
                                    </div>
                                    <span className={`status-badge ${isActive(announcement) ? 'active' : 'expired'}`}>
                                        {isActive(announcement) ? 'Active' : 'Expired'}
                                    </span>
                                </div>
                                <div className="announcement-body">
                                    <h3>{announcement.title}</h3>
                                    <p className="description">{announcement.description?.substring(0, 150)}...</p>
                                    <div className="announcement-meta">
                                        <span><Calendar size={14} /> {announcement.start_date} - {announcement.end_date}</span>
                                        <span>
                                            {announcement.target_type === 'all' && <><Users size={14} /> All Employees</>}
                                            {announcement.target_type === 'department' && <><Building size={14} /> Specific Departments</>}
                                            {announcement.target_type === 'employee' && <><Users size={14} /> Specific Employees</>}
                                        </span>
                                    </div>
                                </div>
                                <div className="announcement-actions">
                                    <button className="btn btn-icon btn-ghost btn-sm" onClick={() => handleView(announcement)} title="View">
                                        <Eye size={16} />
                                    </button>
                                    <button className="btn btn-icon btn-ghost btn-sm" onClick={() => handleEdit(announcement)} title="Edit">
                                        <Edit2 size={16} />
                                    </button>
                                    <button className="btn btn-icon btn-ghost btn-sm text-danger" onClick={() => handleDelete(announcement.id)} title="Delete">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Create/Edit Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'} size="lg">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Description *</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={5}
                            required
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Start Date *</label>
                            <input
                                type="date"
                                value={formData.start_date}
                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>End Date *</label>
                            <input
                                type="date"
                                value={formData.end_date}
                                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Target Audience</label>
                        <select
                            value={formData.target_type}
                            onChange={(e) => setFormData({ ...formData, target_type: e.target.value })}
                        >
                            <option value="all">All Employees</option>
                            <option value="department">Specific Departments</option>
                            <option value="employee">Specific Employees</option>
                        </select>
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">
                            <Send size={16} /> {editingAnnouncement ? 'Update' : 'Publish'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* View Modal */}
            <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Announcement Details" size="lg">
                {selectedAnnouncement && (
                    <div className="announcement-detail">
                        <h2>{selectedAnnouncement.title}</h2>
                        <div className="detail-meta">
                            <span><Calendar size={14} /> {selectedAnnouncement.start_date} - {selectedAnnouncement.end_date}</span>
                            <span className={`status-badge ${isActive(selectedAnnouncement) ? 'active' : 'expired'}`}>
                                {isActive(selectedAnnouncement) ? 'Active' : 'Expired'}
                            </span>
                        </div>
                        <div className="detail-content">
                            <p>{selectedAnnouncement.description}</p>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
