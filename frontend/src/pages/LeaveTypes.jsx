import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, ClipboardList, FileText, Settings } from 'lucide-react';
import api from '../services/api';
import Modal from '../components/Modal';
import './LeaveTypes.css';

export default function LeaveTypes() {
    const [activeTab, setActiveTab] = useState('leaveTypes');
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [awardTypes, setAwardTypes] = useState([]);
    const [terminationTypes, setTerminationTypes] = useState([]);
    const [documentTypes, setDocumentTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [ltRes, atRes, ttRes, dtRes] = await Promise.all([
                api.get('/leave-types'),
                api.get('/award-types'),
                api.get('/termination-types'),
                api.get('/document-types')
            ]);
            setLeaveTypes(ltRes.data.data || []);
            setAwardTypes(atRes.data.data || []);
            setTerminationTypes(ttRes.data.data || []);
            setDocumentTypes(dtRes.data.data || []);
        } catch (error) {
            console.error('Error loading data:', error);
        }
        setLoading(false);
    };

    const openModal = (item = {}) => {
        setFormData(item);
        setShowModal(true);
    };

    const getEndpoint = () => {
        switch (activeTab) {
            case 'leaveTypes': return '/leave-types';
            case 'awardTypes': return '/award-types';
            case 'terminationTypes': return '/termination-types';
            case 'documentTypes': return '/document-types';
            default: return '/leave-types';
        }
    };

    const getData = () => {
        switch (activeTab) {
            case 'leaveTypes': return leaveTypes;
            case 'awardTypes': return awardTypes;
            case 'terminationTypes': return terminationTypes;
            case 'documentTypes': return documentTypes;
            default: return [];
        }
    };

    const getLabel = () => {
        switch (activeTab) {
            case 'leaveTypes': return 'Leave Type';
            case 'awardTypes': return 'Award Type';
            case 'terminationTypes': return 'Termination Type';
            case 'documentTypes': return 'Document Type';
            default: return 'Type';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = getEndpoint();
            if (formData.id) {
                await api.put(`${endpoint}/${formData.id}`, formData);
            } else {
                await api.post(endpoint, formData);
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
            await api.delete(`${getEndpoint()}/${id}`);
            loadData();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const tabs = [
        { key: 'leaveTypes', label: 'Leave Types', icon: Calendar },
        { key: 'awardTypes', label: 'Award Types', icon: ClipboardList },
        { key: 'terminationTypes', label: 'Termination Types', icon: FileText },
        { key: 'documentTypes', label: 'Document Types', icon: Settings },
    ];

    return (
        <div className="leave-types-page">
            <div className="page-header">
                <div>
                    <h1>Configuration</h1>
                    <p className="breadcrumb">Settings &gt; {getLabel()}s</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-primary" onClick={() => openModal()}>
                        <Plus size={18} /> Add {getLabel()}
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card blue">
                    <div className="stat-icon"><Calendar size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{leaveTypes.length}</span>
                        <span className="stat-label">Leave Types</span>
                    </div>
                </div>
                <div className="stat-card green">
                    <div className="stat-icon"><ClipboardList size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{awardTypes.length}</span>
                        <span className="stat-label">Award Types</span>
                    </div>
                </div>
                <div className="stat-card orange">
                    <div className="stat-icon"><FileText size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{terminationTypes.length}</span>
                        <span className="stat-label">Termination Types</span>
                    </div>
                </div>
                <div className="stat-card purple">
                    <div className="stat-icon"><Settings size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{documentTypes.length}</span>
                        <span className="stat-label">Document Types</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.key}
                            className={`tab ${activeTab === tab.key ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            <Icon size={16} /> {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Table */}
            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                {activeTab === 'leaveTypes' && <th>Days Per Year</th>}
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getData().length === 0 ? (
                                <tr><td colSpan={activeTab === 'leaveTypes' ? 5 : 4} className="empty-row">No {getLabel()}s found</td></tr>
                            ) : (
                                getData().map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td><strong>{item.name || item.title}</strong></td>
                                        {activeTab === 'leaveTypes' && <td>{item.days || item.days_per_year || '-'}</td>}
                                        <td>{item.description || '-'}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button className="btn btn-sm" onClick={() => openModal(item)}><Edit size={14} /></button>
                                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={`${formData.id ? 'Edit' : 'Add'} ${getLabel()}`}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name *</label>
                        <input
                            type="text"
                            value={formData.name || formData.title || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value, title: e.target.value })}
                            required
                        />
                    </div>
                    {activeTab === 'leaveTypes' && (
                        <div className="form-group">
                            <label>Days Per Year</label>
                            <input
                                type="number"
                                value={formData.days || formData.days_per_year || ''}
                                onChange={(e) => setFormData({ ...formData, days: e.target.value, days_per_year: e.target.value })}
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={formData.description || ''}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                        ></textarea>
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
