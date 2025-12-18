import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FolderOpen, Users, Calendar, Clock, Eye, MoreVertical, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Modal from '../components/Modal';
import './Projects.css';

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({});
    const [viewMode, setViewMode] = useState('grid');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        setLoading(true);
        try {
            const res = await api.get('/projects');
            setProjects(res.data.data?.data || res.data.data || []);
        } catch (error) {
            console.error('Error loading projects:', error);
        }
        setLoading(false);
    };

    const openModal = (project = {}) => {
        setFormData(project);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.id) {
                await api.put(`/projects/${formData.id}`, formData);
            } else {
                await api.post('/projects', formData);
            }
            setShowModal(false);
            loadProjects();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            await api.delete(`/projects/${id}`);
            loadProjects();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            not_started: '#6b7280',
            in_progress: '#3b82f6',
            on_hold: '#f97316',
            completed: '#22c55e',
            cancelled: '#ef4444'
        };
        return colors[status] || colors.not_started;
    };

    const getProgress = (project) => {
        if (!project.tasks_count) return 0;
        return Math.round((project.completed_tasks_count || 0) / project.tasks_count * 100);
    };

    const filteredProjects = filter === 'all'
        ? projects
        : projects.filter(p => p.status === filter);

    const stats = {
        total: projects.length,
        inProgress: projects.filter(p => p.status === 'in_progress').length,
        completed: projects.filter(p => p.status === 'completed').length,
        onHold: projects.filter(p => p.status === 'on_hold').length
    };

    return (
        <div className="projects-page">
            <div className="page-header">
                <div>
                    <h1>Projects</h1>
                    <p className="breadcrumb">Time Tracking &gt; Projects</p>
                </div>
                <div className="header-actions">
                    <div className="view-toggle">
                        <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}>Grid</button>
                        <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>List</button>
                    </div>
                    <button className="btn btn-primary" onClick={() => openModal()}>
                        <Plus size={18} /> Create Project
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card blue" onClick={() => setFilter('all')}>
                    <div className="stat-icon"><FolderOpen size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.total}</span>
                        <span className="stat-label">Total Projects</span>
                    </div>
                </div>
                <div className="stat-card orange" onClick={() => setFilter('in_progress')}>
                    <div className="stat-icon"><Clock size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.inProgress}</span>
                        <span className="stat-label">In Progress</span>
                    </div>
                </div>
                <div className="stat-card green" onClick={() => setFilter('completed')}>
                    <div className="stat-icon"><CheckCircle size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.completed}</span>
                        <span className="stat-label">Completed</span>
                    </div>
                </div>
                <div className="stat-card purple" onClick={() => setFilter('on_hold')}>
                    <div className="stat-icon"><Calendar size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.onHold}</span>
                        <span className="stat-label">On Hold</span>
                    </div>
                </div>
            </div>

            {/* Filter */}
            <div className="filter-bar">
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="all">All Projects</option>
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="on_hold">On Hold</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            {/* Content */}
            {loading ? (
                <div className="loading">Loading...</div>
            ) : viewMode === 'grid' ? (
                <div className="projects-grid">
                    {filteredProjects.map(project => (
                        <div key={project.id} className="project-card">
                            <div className="project-header">
                                <div className="status-dot" style={{ backgroundColor: getStatusColor(project.status) }}></div>
                                <h3>{project.name}</h3>
                                <div className="project-actions">
                                    <button className="icon-btn" onClick={() => openModal(project)}><Edit size={14} /></button>
                                    <button className="icon-btn" onClick={() => handleDelete(project.id)}><Trash2 size={14} /></button>
                                </div>
                            </div>
                            <p className="project-desc">{project.description || 'No description'}</p>
                            <div className="project-progress">
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: `${getProgress(project)}%` }}></div>
                                </div>
                                <span>{getProgress(project)}%</span>
                            </div>
                            <div className="project-meta">
                                <span><Calendar size={14} /> {project.start_date || 'N/A'}</span>
                                <span><Users size={14} /> {project.members_count || 0} members</span>
                            </div>
                            <div className="project-footer">
                                <span className={`status-badge ${project.status}`}>{project.status?.replace('_', ' ')}</span>
                                <Link to={`/projects/${project.id}`} className="btn btn-sm">
                                    <Eye size={14} /> View
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Project</th>
                                <th>Status</th>
                                <th>Start Date</th>
                                <th>Due Date</th>
                                <th>Progress</th>
                                <th>Members</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProjects.map(project => (
                                <tr key={project.id}>
                                    <td><strong>{project.name}</strong></td>
                                    <td><span className={`status-badge ${project.status}`}>{project.status?.replace('_', ' ')}</span></td>
                                    <td>{project.start_date || 'N/A'}</td>
                                    <td>{project.due_date || project.end_date || 'N/A'}</td>
                                    <td>
                                        <div className="progress-mini">
                                            <div className="progress-bar">
                                                <div className="progress-fill" style={{ width: `${getProgress(project)}%` }}></div>
                                            </div>
                                            <span>{getProgress(project)}%</span>
                                        </div>
                                    </td>
                                    <td>{project.members_count || 0}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <Link to={`/projects/${project.id}`} className="btn btn-sm"><Eye size={14} /></Link>
                                            <button className="btn btn-sm" onClick={() => openModal(project)}><Edit size={14} /></button>
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(project.id)}><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={`${formData.id ? 'Edit' : 'Create'} Project`}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Project Name *</label>
                        <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Start Date</label>
                            <input type="date" value={formData.start_date || ''} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Due Date</label>
                            <input type="date" value={formData.due_date || formData.end_date || ''} onChange={(e) => setFormData({ ...formData, due_date: e.target.value, end_date: e.target.value })} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <select value={formData.status || 'not_started'} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                            <option value="not_started">Not Started</option>
                            <option value="in_progress">In Progress</option>
                            <option value="on_hold">On Hold</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Budget</label>
                        <input type="number" value={formData.budget || ''} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3}></textarea>
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
