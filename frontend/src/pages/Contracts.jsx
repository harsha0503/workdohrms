import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FileText, Calendar, AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import contractService from '../services/contractService';
import Modal from '../components/Modal';
import './Contracts.css';

export default function Contracts() {
    const [activeTab, setActiveTab] = useState('contracts');
    const [contracts, setContracts] = useState([]);
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [formData, setFormData] = useState({});
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadData();
    }, [filter]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [typesRes, contractsRes] = await Promise.all([
                contractService.getContractTypes(),
                contractService.getContracts({ status: filter !== 'all' ? filter : undefined })
            ]);
            setTypes(typesRes.data.data || []);
            setContracts(contractsRes.data.data?.data || contractsRes.data.data || []);
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
            if (modalType === 'contract') {
                if (formData.id) {
                    await contractService.updateContract(formData.id, formData);
                } else {
                    await contractService.createContract(formData);
                }
            } else if (modalType === 'type') {
                if (formData.id) {
                    await contractService.updateContractType(formData.id, formData);
                } else {
                    await contractService.createContractType(formData);
                }
            } else if (modalType === 'renew') {
                await contractService.renewContract(formData.contract_id, formData);
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
            if (type === 'contract') await contractService.deleteContract(id);
            else if (type === 'type') await contractService.deleteContractType(id);
            loadData();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleTerminate = async (id) => {
        const reason = prompt('Enter termination reason:');
        if (!reason) return;
        try {
            await contractService.terminateContract(id, { reason, termination_date: new Date().toISOString().split('T')[0] });
            loadData();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            active: 'badge-success',
            expired: 'badge-danger',
            terminated: 'badge-danger',
            pending: 'badge-warning',
            draft: 'badge-secondary',
        };
        return badges[status] || 'badge-secondary';
    };

    const getDaysRemaining = (endDate) => {
        if (!endDate) return null;
        const end = new Date(endDate);
        const now = new Date();
        const days = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
        return days;
    };

    const expiringContracts = contracts.filter(c => {
        const days = getDaysRemaining(c.end_date);
        return days !== null && days <= 30 && days > 0 && c.status === 'active';
    });

    return (
        <div className="contracts-page">
            <div className="page-header">
                <div>
                    <h1>Contract Management</h1>
                    <p className="breadcrumb">HR Management &gt; Contracts</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-secondary" onClick={() => openModal('type')}>
                        <Plus size={18} /> Add Type
                    </button>
                    <button className="btn btn-primary" onClick={() => openModal('contract')}>
                        <Plus size={18} /> New Contract
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card blue">
                    <div className="stat-icon"><FileText size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{contracts.length}</span>
                        <span className="stat-label">Total Contracts</span>
                    </div>
                </div>
                <div className="stat-card green">
                    <div className="stat-icon"><CheckCircle size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{contracts.filter(c => c.status === 'active').length}</span>
                        <span className="stat-label">Active</span>
                    </div>
                </div>
                <div className="stat-card orange">
                    <div className="stat-icon"><AlertTriangle size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{expiringContracts.length}</span>
                        <span className="stat-label">Expiring Soon</span>
                    </div>
                </div>
                <div className="stat-card red">
                    <div className="stat-icon"><XCircle size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{contracts.filter(c => c.status === 'expired').length}</span>
                        <span className="stat-label">Expired</span>
                    </div>
                </div>
            </div>

            {/* Expiring Soon Alert */}
            {expiringContracts.length > 0 && (
                <div className="alert alert-warning">
                    <AlertTriangle size={18} />
                    <span><strong>{expiringContracts.length} contracts</strong> expiring within 30 days!</span>
                </div>
            )}

            {/* Tabs */}
            <div className="tabs">
                <button className={`tab ${activeTab === 'contracts' ? 'active' : ''}`} onClick={() => setActiveTab('contracts')}>
                    <FileText size={18} /> Contracts
                </button>
                <button className={`tab ${activeTab === 'types' ? 'active' : ''}`} onClick={() => setActiveTab('types')}>
                    <Calendar size={18} /> Contract Types
                </button>
            </div>

            {/* Filters */}
            {activeTab === 'contracts' && (
                <div className="filters">
                    <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
                        <option value="all">All Contracts</option>
                        <option value="active">Active</option>
                        <option value="expired">Expired</option>
                        <option value="terminated">Terminated</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
            )}

            {/* Content */}
            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <>
                    {activeTab === 'contracts' && (
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Employee</th>
                                        <th>Contract Type</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contracts.length === 0 ? (
                                        <tr><td colSpan={7} className="empty-row">No contracts found</td></tr>
                                    ) : (
                                        contracts.map((contract, index) => {
                                            const daysRemaining = getDaysRemaining(contract.end_date);
                                            return (
                                                <tr key={contract.id}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <div className="employee-cell">
                                                            <div className="avatar">{contract.staff_member?.full_name?.charAt(0) || 'E'}</div>
                                                            <div>
                                                                <span className="name">{contract.staff_member?.full_name || 'N/A'}</span>
                                                                <span className="email">{contract.staff_member?.email}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>{contract.contract_type?.name || '-'}</td>
                                                    <td>{contract.start_date ? new Date(contract.start_date).toLocaleDateString() : '-'}</td>
                                                    <td>
                                                        <div className="end-date-cell">
                                                            {contract.end_date ? new Date(contract.end_date).toLocaleDateString() : 'Ongoing'}
                                                            {daysRemaining && daysRemaining <= 30 && daysRemaining > 0 && (
                                                                <span className="days-remaining warning">{daysRemaining} days left</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${getStatusBadge(contract.status)}`}>{contract.status}</span>
                                                    </td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            {contract.status === 'active' && (
                                                                <>
                                                                    <button className="btn btn-sm btn-success" onClick={() => openModal('renew', { contract_id: contract.id })} title="Renew">
                                                                        <RefreshCw size={14} />
                                                                    </button>
                                                                    <button className="btn btn-sm btn-danger" onClick={() => handleTerminate(contract.id)} title="Terminate">
                                                                        <XCircle size={14} />
                                                                    </button>
                                                                </>
                                                            )}
                                                            <button className="btn btn-sm" onClick={() => openModal('contract', contract)}><Edit size={14} /></button>
                                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete('contract', contract.id)}><Trash2 size={14} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'types' && (
                        <div className="types-grid">
                            {types.map(type => (
                                <div key={type.id} className="type-card">
                                    <div className="type-icon"><FileText size={24} /></div>
                                    <h3>{type.name}</h3>
                                    <p>{type.description || 'No description'}</p>
                                    {type.default_duration_months && (
                                        <span className="duration">Duration: {type.default_duration_months} months</span>
                                    )}
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
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={modalType === 'renew' ? 'Renew Contract' : `${formData.id ? 'Edit' : 'Add'} ${modalType}`}>
                <form onSubmit={handleSubmit}>
                    {modalType === 'type' && (
                        <>
                            <div className="form-group">
                                <label>Type Name *</label>
                                <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Default Duration (months)</label>
                                <input type="number" value={formData.default_duration_months || ''} onChange={(e) => setFormData({ ...formData, default_duration_months: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3}></textarea>
                            </div>
                        </>
                    )}
                    {modalType === 'contract' && (
                        <>
                            <div className="form-group">
                                <label>Employee ID *</label>
                                <input type="number" value={formData.staff_member_id || ''} onChange={(e) => setFormData({ ...formData, staff_member_id: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Contract Type *</label>
                                <select value={formData.contract_type_id || ''} onChange={(e) => setFormData({ ...formData, contract_type_id: e.target.value })} required>
                                    <option value="">Select Type</option>
                                    {types.map(type => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Start Date *</label>
                                    <input type="date" value={formData.start_date || ''} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>End Date</label>
                                    <input type="date" value={formData.end_date || ''} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Salary</label>
                                <input type="number" value={formData.salary || ''} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Terms & Conditions</label>
                                <textarea value={formData.terms_conditions || ''} onChange={(e) => setFormData({ ...formData, terms_conditions: e.target.value })} rows={4}></textarea>
                            </div>
                        </>
                    )}
                    {modalType === 'renew' && (
                        <>
                            <div className="form-group">
                                <label>New End Date *</label>
                                <input type="date" value={formData.new_end_date || ''} onChange={(e) => setFormData({ ...formData, new_end_date: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>New Salary</label>
                                <input type="number" value={formData.new_salary || ''} onChange={(e) => setFormData({ ...formData, new_salary: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Renewal Notes</label>
                                <textarea value={formData.notes || ''} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3}></textarea>
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
