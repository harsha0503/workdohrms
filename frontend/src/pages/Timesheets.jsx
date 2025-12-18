import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Clock, Calendar, CheckCircle, XCircle, Send, Folder } from 'lucide-react';
import timesheetService from '../services/timesheetService';
import Modal from '../components/Modal';
import './Timesheets.css';

export default function Timesheets() {
    const [activeTab, setActiveTab] = useState('timesheets');
    const [timesheets, setTimesheets] = useState([]);
    const [projects, setProjects] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [formData, setFormData] = useState({});
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadData();
    }, [activeTab, filter]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [projectsRes, shiftsRes, timesheetsRes] = await Promise.all([
                timesheetService.getProjects(),
                timesheetService.getShifts(),
                timesheetService.getTimesheets({ status: filter !== 'all' ? filter : undefined })
            ]);
            setProjects(projectsRes.data.data?.data || projectsRes.data.data || []);
            setShifts(shiftsRes.data.data || []);
            setTimesheets(timesheetsRes.data.data?.data || timesheetsRes.data.data || []);
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
            if (modalType === 'timesheet') {
                if (formData.id) {
                    await timesheetService.updateTimesheet(formData.id, formData);
                } else {
                    await timesheetService.createTimesheet(formData);
                }
            } else if (modalType === 'project') {
                if (formData.id) {
                    await timesheetService.updateProject(formData.id, formData);
                } else {
                    await timesheetService.createProject(formData);
                }
            } else if (modalType === 'shift') {
                if (formData.id) {
                    await timesheetService.updateShift(formData.id, formData);
                } else {
                    await timesheetService.createShift(formData);
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
            if (type === 'timesheet') await timesheetService.deleteTimesheet(id);
            else if (type === 'project') await timesheetService.deleteProject(id);
            else if (type === 'shift') await timesheetService.deleteShift(id);
            loadData();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSubmitTimesheet = async (id) => {
        try {
            await timesheetService.submitTimesheet(id);
            loadData();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleApprove = async (id) => {
        try {
            await timesheetService.approveTimesheet(id);
            loadData();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleReject = async (id) => {
        const reason = prompt('Enter rejection reason:');
        if (!reason) return;
        try {
            await timesheetService.rejectTimesheet(id, reason);
            loadData();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            draft: 'badge-secondary',
            submitted: 'badge-info',
            approved: 'badge-success',
            rejected: 'badge-danger',
        };
        return badges[status] || 'badge-secondary';
    };

    const formatHours = (hours) => {
        if (!hours) return '0h';
        return `${hours}h`;
    };

    // Calculate total hours
    const totalHours = timesheets.reduce((sum, t) => sum + (parseFloat(t.hours) || 0), 0);
    const approvedHours = timesheets.filter(t => t.status === 'approved').reduce((sum, t) => sum + (parseFloat(t.hours) || 0), 0);

    return (
        <div className="timesheets-page">
            <div className="page-header">
                <div>
                    <h1>Time Tracking</h1>
                    <p className="breadcrumb">Time Tracking &gt; Timesheets</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-secondary" onClick={() => openModal('project')}>
                        <Folder size={18} /> Add Project
                    </button>
                    <button className="btn btn-secondary" onClick={() => openModal('shift')}>
                        <Clock size={18} /> Add Shift
                    </button>
                    <button className="btn btn-primary" onClick={() => openModal('timesheet')}>
                        <Plus size={18} /> Log Time
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card blue">
                    <div className="stat-icon"><Clock size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{formatHours(totalHours)}</span>
                        <span className="stat-label">Total Hours</span>
                    </div>
                </div>
                <div className="stat-card green">
                    <div className="stat-icon"><CheckCircle size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{formatHours(approvedHours)}</span>
                        <span className="stat-label">Approved Hours</span>
                    </div>
                </div>
                <div className="stat-card orange">
                    <div className="stat-icon"><Send size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{timesheets.filter(t => t.status === 'submitted').length}</span>
                        <span className="stat-label">Pending Approval</span>
                    </div>
                </div>
                <div className="stat-card purple">
                    <div className="stat-icon"><Folder size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{projects.length}</span>
                        <span className="stat-label">Projects</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs">
                <button className={`tab ${activeTab === 'timesheets' ? 'active' : ''}`} onClick={() => setActiveTab('timesheets')}>
                    <Clock size={18} /> Timesheets
                </button>
                <button className={`tab ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>
                    <Folder size={18} /> Projects
                </button>
                <button className={`tab ${activeTab === 'shifts' ? 'active' : ''}`} onClick={() => setActiveTab('shifts')}>
                    <Calendar size={18} /> Shifts
                </button>
            </div>

            {/* Filters */}
            {activeTab === 'timesheets' && (
                <div className="filters">
                    <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
                        <option value="all">All Status</option>
                        <option value="draft">Draft</option>
                        <option value="submitted">Submitted</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            )}

            {/* Content */}
            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <>
                    {activeTab === 'timesheets' && (
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Employee</th>
                                        <th>Project</th>
                                        <th>Hours</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {timesheets.length === 0 ? (
                                        <tr><td colSpan={7} className="empty-row">No timesheets found</td></tr>
                                    ) : (
                                        timesheets.map(timesheet => (
                                            <tr key={timesheet.id}>
                                                <td>{timesheet.date ? new Date(timesheet.date).toLocaleDateString() : '-'}</td>
                                                <td>{timesheet.staff_member?.full_name || 'N/A'}</td>
                                                <td>{timesheet.project?.name || '-'}</td>
                                                <td><strong>{formatHours(timesheet.hours)}</strong></td>
                                                <td className="description-cell">{timesheet.description?.substring(0, 50) || '-'}</td>
                                                <td>
                                                    <span className={`badge ${getStatusBadge(timesheet.status)}`}>{timesheet.status}</span>
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        {timesheet.status === 'draft' && (
                                                            <button className="btn btn-sm btn-info" onClick={() => handleSubmitTimesheet(timesheet.id)} title="Submit">
                                                                <Send size={14} />
                                                            </button>
                                                        )}
                                                        {timesheet.status === 'submitted' && (
                                                            <>
                                                                <button className="btn btn-sm btn-success" onClick={() => handleApprove(timesheet.id)} title="Approve">
                                                                    <CheckCircle size={14} />
                                                                </button>
                                                                <button className="btn btn-sm btn-danger" onClick={() => handleReject(timesheet.id)} title="Reject">
                                                                    <XCircle size={14} />
                                                                </button>
                                                            </>
                                                        )}
                                                        <button className="btn btn-sm" onClick={() => openModal('timesheet', timesheet)}><Edit size={14} /></button>
                                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete('timesheet', timesheet.id)}><Trash2 size={14} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'projects' && (
                        <div className="projects-grid">
                            {projects.map(project => (
                                <div key={project.id} className="project-card">
                                    <div className="project-icon"><Folder size={32} /></div>
                                    <h3>{project.name}</h3>
                                    <p>{project.description || 'No description'}</p>
                                    <div className="project-meta">
                                        {project.client && <span>Client: {project.client}</span>}
                                        <span className={`badge ${project.is_active ? 'badge-success' : 'badge-secondary'}`}>
                                            {project.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div className="card-actions">
                                        <button className="btn btn-sm" onClick={() => openModal('project', project)}><Edit size={14} /></button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete('project', project.id)}><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'shifts' && (
                        <div className="shifts-grid">
                            {shifts.map(shift => (
                                <div key={shift.id} className="shift-card">
                                    <div className="shift-times">
                                        <span className="start">{shift.start_time}</span>
                                        <span className="separator">-</span>
                                        <span className="end">{shift.end_time}</span>
                                    </div>
                                    <h3>{shift.name}</h3>
                                    <p>{shift.description || 'No description'}</p>
                                    <div className="card-actions">
                                        <button className="btn btn-sm" onClick={() => openModal('shift', shift)}><Edit size={14} /></button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete('shift', shift.id)}><Trash2 size={14} /></button>
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
                    {modalType === 'project' && (
                        <>
                            <div className="form-group">
                                <label>Project Name *</label>
                                <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Client</label>
                                <input type="text" value={formData.client || ''} onChange={(e) => setFormData({ ...formData, client: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3}></textarea>
                            </div>
                        </>
                    )}
                    {modalType === 'shift' && (
                        <>
                            <div className="form-group">
                                <label>Shift Name *</label>
                                <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Start Time *</label>
                                    <input type="time" value={formData.start_time || ''} onChange={(e) => setFormData({ ...formData, start_time: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>End Time *</label>
                                    <input type="time" value={formData.end_time || ''} onChange={(e) => setFormData({ ...formData, end_time: e.target.value })} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Break Duration (minutes)</label>
                                <input type="number" value={formData.break_duration || ''} onChange={(e) => setFormData({ ...formData, break_duration: e.target.value })} />
                            </div>
                        </>
                    )}
                    {modalType === 'timesheet' && (
                        <>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Date *</label>
                                    <input type="date" value={formData.date || ''} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Hours *</label>
                                    <input type="number" step="0.5" value={formData.hours || ''} onChange={(e) => setFormData({ ...formData, hours: e.target.value })} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Project</label>
                                <select value={formData.timesheet_project_id || ''} onChange={(e) => setFormData({ ...formData, timesheet_project_id: e.target.value })}>
                                    <option value="">Select Project</option>
                                    {projects.map(proj => (
                                        <option key={proj.id} value={proj.id}>{proj.name}</option>
                                    ))}
                                </select>
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
