import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Target, TrendingUp, Award, BarChart3, Users, CheckCircle, Clock } from 'lucide-react';
import performanceService from '../services/performanceService';
import Modal from '../components/Modal';
import './Performance.css';

export default function Performance() {
    const [activeTab, setActiveTab] = useState('appraisals');
    const [data, setData] = useState([]);
    const [indicators, setIndicators] = useState([]);
    const [goalTypes, setGoalTypes] = useState([]);
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
            const [indicatorsRes, goalTypesRes] = await Promise.all([
                performanceService.getIndicators(),
                performanceService.getGoalTypes()
            ]);
            setIndicators(indicatorsRes.data.data || []);
            setGoalTypes(goalTypesRes.data.data || []);

            let res;
            switch (activeTab) {
                case 'appraisals': res = await performanceService.getAppraisals(); break;
                case 'goals': res = await performanceService.getGoals(); break;
                case 'indicators': res = await performanceService.getIndicators(); break;
                case 'competencies': res = await performanceService.getCompetencies(); break;
                default: res = { data: { data: [] } };
            }
            setData(res.data.data?.data || res.data.data || []);
        } catch (error) {
            console.error('Error loading data:', error);
            setData([]);
        }
        setLoading(false);
    };

    const openModal = (type, item = {}) => {
        setModalType(type);
        setFormData(item);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalType === 'appraisal') {
                if (formData.id) await performanceService.updateAppraisal(formData.id, formData);
                else await performanceService.createAppraisal(formData);
            } else if (modalType === 'goal') {
                if (formData.id) await performanceService.updateGoal(formData.id, formData);
                else await performanceService.createGoal(formData);
            } else if (modalType === 'indicator') {
                if (formData.id) await performanceService.updateIndicator(formData.id, formData);
                else await performanceService.createIndicator(formData);
            } else if (modalType === 'goalType') {
                if (formData.id) await performanceService.updateGoalType(formData.id, formData);
                else await performanceService.createGoalType(formData);
            }
            setShowModal(false);
            loadData();
        } catch (error) {
            console.error('Error saving:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            switch (activeTab) {
                case 'appraisals': await performanceService.deleteAppraisal(id); break;
                case 'goals': await performanceService.deleteGoal(id); break;
                case 'indicators': await performanceService.deleteIndicator(id); break;
                default: break;
            }
            loadData();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: 'badge-warning',
            submitted: 'badge-info',
            approved: 'badge-success',
            rejected: 'badge-danger',
            completed: 'badge-success',
            in_progress: 'badge-info',
            not_started: 'badge-secondary',
        };
        return badges[status] || 'badge-secondary';
    };

    const renderStats = () => (
        <div className="stats-grid">
            <div className="stat-card blue">
                <div className="stat-icon"><TrendingUp size={24} /></div>
                <div className="stat-info">
                    <span className="stat-value">{data.length}</span>
                    <span className="stat-label">Total {activeTab === 'goals' ? 'Goals' : 'Appraisals'}</span>
                </div>
            </div>
            <div className="stat-card green">
                <div className="stat-icon"><CheckCircle size={24} /></div>
                <div className="stat-info">
                    <span className="stat-value">{data.filter(d => d.status === 'approved' || d.status === 'completed').length}</span>
                    <span className="stat-label">Completed</span>
                </div>
            </div>
            <div className="stat-card orange">
                <div className="stat-icon"><Clock size={24} /></div>
                <div className="stat-info">
                    <span className="stat-value">{data.filter(d => d.status === 'pending' || d.status === 'in_progress').length}</span>
                    <span className="stat-label">In Progress</span>
                </div>
            </div>
            <div className="stat-card purple">
                <div className="stat-icon"><Target size={24} /></div>
                <div className="stat-info">
                    <span className="stat-value">{indicators.length}</span>
                    <span className="stat-label">Indicators</span>
                </div>
            </div>
        </div>
    );

    const renderAppraisalsTable = () => (
        <div className="table-container">
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Employee</th>
                        <th>Branch</th>
                        <th>Department</th>
                        <th>Appraisal Date</th>
                        <th>Rating</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr><td colSpan={7} className="empty-row">No appraisals found</td></tr>
                    ) : (
                        data.map(item => (
                            <tr key={item.id}>
                                <td>
                                    <div className="employee-cell">
                                        <div className="avatar">{item.staff_member?.full_name?.charAt(0) || 'E'}</div>
                                        <span>{item.staff_member?.full_name || '-'}</span>
                                    </div>
                                </td>
                                <td>{item.branch?.name || '-'}</td>
                                <td>{item.department?.name || '-'}</td>
                                <td>{item.appraisal_date ? new Date(item.appraisal_date).toLocaleDateString() : '-'}</td>
                                <td>
                                    <div className="rating">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <span key={star} className={star <= (item.rating || 0) ? 'star filled' : 'star'}>★</span>
                                        ))}
                                    </div>
                                </td>
                                <td><span className={`badge ${getStatusBadge(item.status)}`}>{item.status}</span></td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="btn btn-sm" onClick={() => openModal('appraisal', item)}><Edit size={14} /></button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}><Trash2 size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );

    const renderGoalsTable = () => (
        <div className="table-container">
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Goal</th>
                        <th>Type</th>
                        <th>Employee</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Progress</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr><td colSpan={8} className="empty-row">No goals found</td></tr>
                    ) : (
                        data.map(item => (
                            <tr key={item.id}>
                                <td><strong>{item.name || item.title || '-'}</strong></td>
                                <td>{item.goal_type?.name || '-'}</td>
                                <td>{item.staff_member?.full_name || '-'}</td>
                                <td>{item.start_date ? new Date(item.start_date).toLocaleDateString() : '-'}</td>
                                <td>{item.end_date ? new Date(item.end_date).toLocaleDateString() : '-'}</td>
                                <td>
                                    <div className="progress-bar-container">
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${item.progress || 0}%` }}></div>
                                        </div>
                                        <span>{item.progress || 0}%</span>
                                    </div>
                                </td>
                                <td><span className={`badge ${getStatusBadge(item.status)}`}>{item.status}</span></td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="btn btn-sm" onClick={() => openModal('goal', item)}><Edit size={14} /></button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}><Trash2 size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );

    const renderIndicatorsGrid = () => (
        <div className="indicators-grid">
            {data.map(indicator => (
                <div key={indicator.id} className="indicator-card">
                    <div className="indicator-icon"><Target size={28} /></div>
                    <h3>{indicator.name}</h3>
                    <p>{indicator.description || 'No description'}</p>
                    <div className="indicator-ratings">
                        {indicator.ratings && Object.entries(indicator.ratings).map(([key, value]) => (
                            <span key={key} className="rating-tag">{key}: {value}%</span>
                        ))}
                    </div>
                    <div className="card-actions">
                        <button className="btn btn-sm" onClick={() => openModal('indicator', indicator)}><Edit size={14} /></button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(indicator.id)}><Trash2 size={14} /></button>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderForm = () => {
        switch (modalType) {
            case 'appraisal':
                return (
                    <>
                        <div className="form-group">
                            <label>Employee ID *</label>
                            <input type="number" value={formData.staff_member_id || ''} onChange={(e) => setFormData({ ...formData, staff_member_id: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Appraisal Date *</label>
                            <input type="date" value={formData.appraisal_date || ''} onChange={(e) => setFormData({ ...formData, appraisal_date: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Rating (1-5)</label>
                            <input type="number" min="1" max="5" value={formData.rating || ''} onChange={(e) => setFormData({ ...formData, rating: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Remarks</label>
                            <textarea value={formData.remarks || ''} onChange={(e) => setFormData({ ...formData, remarks: e.target.value })} rows={3}></textarea>
                        </div>
                    </>
                );
            case 'goal':
                return (
                    <>
                        <div className="form-group">
                            <label>Goal Name *</label>
                            <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Goal Type</label>
                            <select value={formData.goal_type_id || ''} onChange={(e) => setFormData({ ...formData, goal_type_id: e.target.value })}>
                                <option value="">Select Type</option>
                                {goalTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Employee ID</label>
                            <input type="number" value={formData.staff_member_id || ''} onChange={(e) => setFormData({ ...formData, staff_member_id: e.target.value })} />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Start Date</label>
                                <input type="date" value={formData.start_date || ''} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>End Date</label>
                                <input type="date" value={formData.end_date || ''} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3}></textarea>
                        </div>
                    </>
                );
            case 'indicator':
                return (
                    <>
                        <div className="form-group">
                            <label>Indicator Name *</label>
                            <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3}></textarea>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="performance-page">
            <div className="page-header">
                <div>
                    <h1>Performance Management</h1>
                    <p className="breadcrumb">HR Management &gt; Performance</p>
                </div>
                <div className="header-actions">
                    {activeTab === 'appraisals' && (
                        <button className="btn btn-primary" onClick={() => openModal('appraisal')}>
                            <Plus size={18} /> Create Appraisal
                        </button>
                    )}
                    {activeTab === 'goals' && (
                        <button className="btn btn-primary" onClick={() => openModal('goal')}>
                            <Plus size={18} /> Create Goal
                        </button>
                    )}
                    {activeTab === 'indicators' && (
                        <button className="btn btn-primary" onClick={() => openModal('indicator')}>
                            <Plus size={18} /> Create Indicator
                        </button>
                    )}
                </div>
            </div>

            {renderStats()}

            {/* Tabs */}
            <div className="tabs">
                <button className={`tab ${activeTab === 'appraisals' ? 'active' : ''}`} onClick={() => setActiveTab('appraisals')}>
                    <TrendingUp size={18} /> Appraisals
                </button>
                <button className={`tab ${activeTab === 'goals' ? 'active' : ''}`} onClick={() => setActiveTab('goals')}>
                    <Target size={18} /> Goals
                </button>
                <button className={`tab ${activeTab === 'indicators' ? 'active' : ''}`} onClick={() => setActiveTab('indicators')}>
                    <BarChart3 size={18} /> Indicators
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <>
                    {activeTab === 'appraisals' && renderAppraisalsTable()}
                    {activeTab === 'goals' && renderGoalsTable()}
                    {activeTab === 'indicators' && renderIndicatorsGrid()}
                </>
            )}

            {/* Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={`${formData.id ? 'Edit' : 'Create'} ${modalType}`}>
                <form onSubmit={handleSubmit}>
                    {renderForm()}
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
