import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ClipboardList, Users, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import onboardingService from '../services/onboardingService';
import Modal from '../components/Modal';
import './Onboarding.css';

export default function Onboarding() {
    const [activeTab, setActiveTab] = useState('onboardings');
    const [onboardings, setOnboardings] = useState([]);
    const [templates, setTemplates] = useState([]);
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
            const [templatesRes, onboardingsRes] = await Promise.all([
                onboardingService.getTemplates(),
                onboardingService.getOnboardings()
            ]);
            setTemplates(templatesRes.data.data || []);
            setOnboardings(onboardingsRes.data.data?.data || onboardingsRes.data.data || []);
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
            if (modalType === 'template') {
                if (formData.id) {
                    await onboardingService.updateTemplate(formData.id, formData);
                } else {
                    await onboardingService.createTemplate(formData);
                }
            } else if (modalType === 'assign') {
                await onboardingService.assignOnboarding(formData);
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
            if (type === 'template') await onboardingService.deleteTemplate(id);
            loadData();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const getProgressColor = (progress) => {
        if (progress >= 75) return 'progress-success';
        if (progress >= 50) return 'progress-warning';
        return 'progress-danger';
    };

    return (
        <div className="onboarding-page">
            <div className="page-header">
                <div>
                    <h1>Employee Onboarding</h1>
                    <p className="breadcrumb">Recruitment &gt; Onboarding</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-secondary" onClick={() => openModal('template')}>
                        <ClipboardList size={18} /> Add Template
                    </button>
                    <button className="btn btn-primary" onClick={() => openModal('assign')}>
                        <Plus size={18} /> Assign Onboarding
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card blue">
                    <div className="stat-icon"><Users size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{onboardings.length}</span>
                        <span className="stat-label">In Progress</span>
                    </div>
                </div>
                <div className="stat-card green">
                    <div className="stat-icon"><CheckCircle size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{onboardings.filter(o => o.progress === 100).length}</span>
                        <span className="stat-label">Completed</span>
                    </div>
                </div>
                <div className="stat-card purple">
                    <div className="stat-icon"><ClipboardList size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{templates.length}</span>
                        <span className="stat-label">Templates</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs">
                <button className={`tab ${activeTab === 'onboardings' ? 'active' : ''}`} onClick={() => setActiveTab('onboardings')}>
                    <Users size={18} /> Employee Onboardings
                </button>
                <button className={`tab ${activeTab === 'templates' ? 'active' : ''}`} onClick={() => setActiveTab('templates')}>
                    <ClipboardList size={18} /> Templates
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <>
                    {activeTab === 'onboardings' && (
                        <div className="onboardings-list">
                            {onboardings.length === 0 ? (
                                <div className="empty-state">
                                    <Users size={48} />
                                    <h3>No Active Onboardings</h3>
                                    <p>Assign an onboarding template to a new employee to get started.</p>
                                </div>
                            ) : (
                                onboardings.map(onboarding => (
                                    <div key={onboarding.id} className="onboarding-card">
                                        <div className="employee-avatar">
                                            {onboarding.staff_member?.full_name?.charAt(0) || 'E'}
                                        </div>
                                        <div className="onboarding-info">
                                            <h4>{onboarding.staff_member?.full_name || 'New Employee'}</h4>
                                            <p>{onboarding.template?.name || 'Standard Onboarding'}</p>
                                            <div className="onboarding-dates">
                                                <span><Clock size={14} /> Started: {new Date(onboarding.start_date || onboarding.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="onboarding-progress">
                                            <div className="progress-header">
                                                <span>Progress</span>
                                                <span>{onboarding.progress || 0}%</span>
                                            </div>
                                            <div className="progress-bar">
                                                <div
                                                    className={`progress-fill ${getProgressColor(onboarding.progress || 0)}`}
                                                    style={{ width: `${onboarding.progress || 0}%` }}
                                                ></div>
                                            </div>
                                            <span className="tasks-count">
                                                {onboarding.completed_tasks || 0}/{onboarding.total_tasks || 0} tasks
                                            </span>
                                        </div>
                                        <button className="btn btn-sm">
                                            View <ChevronRight size={14} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'templates' && (
                        <div className="templates-grid">
                            {templates.map(template => (
                                <div key={template.id} className="template-card">
                                    <div className="template-icon"><ClipboardList size={32} /></div>
                                    <h3>{template.name}</h3>
                                    <p>{template.description || 'No description'}</p>
                                    <div className="template-meta">
                                        <span>{template.tasks_count || 0} tasks</span>
                                        <span>{template.duration_days || 0} days</span>
                                    </div>
                                    <div className="card-actions">
                                        <button className="btn btn-sm" onClick={() => openModal('template', template)}><Edit size={14} /></button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete('template', template.id)}><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={modalType === 'assign' ? 'Assign Onboarding' : `${formData.id ? 'Edit' : 'Add'} Template`}>
                <form onSubmit={handleSubmit}>
                    {modalType === 'template' && (
                        <>
                            <div className="form-group">
                                <label>Template Name *</label>
                                <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Duration (days)</label>
                                <input type="number" value={formData.duration_days || ''} onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3}></textarea>
                            </div>
                        </>
                    )}
                    {modalType === 'assign' && (
                        <>
                            <div className="form-group">
                                <label>Employee ID *</label>
                                <input type="number" value={formData.staff_member_id || ''} onChange={(e) => setFormData({ ...formData, staff_member_id: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Onboarding Template *</label>
                                <select value={formData.onboarding_template_id || ''} onChange={(e) => setFormData({ ...formData, onboarding_template_id: e.target.value })} required>
                                    <option value="">Select Template</option>
                                    {templates.map(template => (
                                        <option key={template.id} value={template.id}>{template.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Start Date</label>
                                <input type="date" value={formData.start_date || ''} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} />
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
