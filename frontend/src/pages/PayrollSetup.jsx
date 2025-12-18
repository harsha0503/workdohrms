import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, DollarSign, Percent, TrendingDown, Calculator, Settings } from 'lucide-react';
import api from '../services/api';
import Modal from '../components/Modal';
import './PayrollSetup.css';

export default function PayrollSetup() {
    const [activeTab, setActiveTab] = useState('allowances');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({});

    const tabs = [
        { key: 'allowances', label: 'Allowance Options', icon: DollarSign },
        { key: 'deductions', label: 'Deduction Options', icon: TrendingDown },
        { key: 'loans', label: 'Loan Options', icon: Calculator },
        { key: 'payslipTypes', label: 'Payslip Types', icon: Settings },
        { key: 'taxBrackets', label: 'Tax Brackets', icon: Percent },
    ];

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            let endpoint;
            switch (activeTab) {
                case 'allowances': endpoint = '/allowance-options'; break;
                case 'deductions': endpoint = '/deduction-options'; break;
                case 'loans': endpoint = '/loan-options'; break;
                case 'payslipTypes': endpoint = '/payslip-types'; break;
                case 'taxBrackets': endpoint = '/tax-brackets'; break;
                default: endpoint = '/allowance-options';
            }
            const res = await api.get(endpoint);
            setData(res.data.data?.data || res.data.data || []);
        } catch (error) {
            console.error('Error loading data:', error);
            setData([]);
        }
        setLoading(false);
    };

    const openModal = (item = {}) => {
        setFormData(item);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let endpoint;
            switch (activeTab) {
                case 'allowances': endpoint = '/allowance-options'; break;
                case 'deductions': endpoint = '/deduction-options'; break;
                case 'loans': endpoint = '/loan-options'; break;
                case 'payslipTypes': endpoint = '/payslip-types'; break;
                case 'taxBrackets': endpoint = '/tax-brackets'; break;
                default: endpoint = '/allowance-options';
            }

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
            let endpoint;
            switch (activeTab) {
                case 'allowances': endpoint = '/allowance-options'; break;
                case 'deductions': endpoint = '/deduction-options'; break;
                case 'loans': endpoint = '/loan-options'; break;
                case 'payslipTypes': endpoint = '/payslip-types'; break;
                case 'taxBrackets': endpoint = '/tax-brackets'; break;
                default: endpoint = '/allowance-options';
            }
            await api.delete(`${endpoint}/${id}`);
            loadData();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const getTabLabel = () => {
        switch (activeTab) {
            case 'allowances': return 'Allowance Option';
            case 'deductions': return 'Deduction Option';
            case 'loans': return 'Loan Option';
            case 'payslipTypes': return 'Payslip Type';
            case 'taxBrackets': return 'Tax Bracket';
            default: return 'Item';
        }
    };

    const renderTable = () => {
        if (loading) return <div className="loading">Loading...</div>;
        if (data.length === 0) return <div className="empty-state"><p>No {getTabLabel()}s found</p></div>;

        return (
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            {activeTab === 'taxBrackets' && (
                                <>
                                    <th>Min Amount</th>
                                    <th>Max Amount</th>
                                    <th>Rate (%)</th>
                                </>
                            )}
                            {activeTab === 'allowances' || activeTab === 'deductions' ? (
                                <>
                                    <th>Type</th>
                                    <th>Amount/Percentage</th>
                                </>
                            ) : null}
                            {activeTab === 'loans' && (
                                <>
                                    <th>Max Amount</th>
                                    <th>Interest Rate</th>
                                </>
                            )}
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td><strong>{item.name}</strong></td>
                                {activeTab === 'taxBrackets' && (
                                    <>
                                        <td>{item.min_amount || '-'}</td>
                                        <td>{item.max_amount || '-'}</td>
                                        <td>{item.rate}%</td>
                                    </>
                                )}
                                {(activeTab === 'allowances' || activeTab === 'deductions') && (
                                    <>
                                        <td>{item.type || 'Fixed'}</td>
                                        <td>{item.type === 'percentage' ? `${item.percentage || 0}%` : `₹${item.amount || 0}`}</td>
                                    </>
                                )}
                                {activeTab === 'loans' && (
                                    <>
                                        <td>₹{item.max_amount || '-'}</td>
                                        <td>{item.interest_rate || 0}%</td>
                                    </>
                                )}
                                <td>
                                    <span className={`badge ${item.is_active !== false ? 'badge-success' : 'badge-secondary'}`}>
                                        {item.is_active !== false ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="btn btn-sm" onClick={() => openModal(item)}><Edit size={14} /></button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}><Trash2 size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderForm = () => {
        switch (activeTab) {
            case 'allowances':
            case 'deductions':
                return (
                    <>
                        <div className="form-group">
                            <label>Name *</label>
                            <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Type</label>
                            <select value={formData.type || 'fixed'} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                                <option value="fixed">Fixed Amount</option>
                                <option value="percentage">Percentage of Basic</option>
                            </select>
                        </div>
                        {formData.type === 'percentage' ? (
                            <div className="form-group">
                                <label>Percentage</label>
                                <input type="number" step="0.01" value={formData.percentage || ''} onChange={(e) => setFormData({ ...formData, percentage: e.target.value })} />
                            </div>
                        ) : (
                            <div className="form-group">
                                <label>Default Amount</label>
                                <input type="number" value={formData.amount || ''} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
                            </div>
                        )}
                    </>
                );
            case 'loans':
                return (
                    <>
                        <div className="form-group">
                            <label>Loan Type Name *</label>
                            <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Maximum Amount</label>
                            <input type="number" value={formData.max_amount || ''} onChange={(e) => setFormData({ ...formData, max_amount: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Interest Rate (%)</label>
                            <input type="number" step="0.01" value={formData.interest_rate || ''} onChange={(e) => setFormData({ ...formData, interest_rate: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Max Tenure (months)</label>
                            <input type="number" value={formData.max_tenure || ''} onChange={(e) => setFormData({ ...formData, max_tenure: e.target.value })} />
                        </div>
                    </>
                );
            case 'payslipTypes':
                return (
                    <>
                        <div className="form-group">
                            <label>Payslip Type Name *</label>
                            <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                        </div>
                    </>
                );
            case 'taxBrackets':
                return (
                    <>
                        <div className="form-group">
                            <label>Bracket Name *</label>
                            <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Minimum Amount</label>
                                <input type="number" value={formData.min_amount || ''} onChange={(e) => setFormData({ ...formData, min_amount: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Maximum Amount</label>
                                <input type="number" value={formData.max_amount || ''} onChange={(e) => setFormData({ ...formData, max_amount: e.target.value })} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Tax Rate (%)</label>
                            <input type="number" step="0.01" value={formData.rate || ''} onChange={(e) => setFormData({ ...formData, rate: e.target.value })} />
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    const ActiveIcon = tabs.find(t => t.key === activeTab)?.icon || DollarSign;

    return (
        <div className="payroll-setup-page">
            <div className="page-header">
                <div>
                    <h1>Payroll Setup</h1>
                    <p className="breadcrumb">Payroll &gt; Setup</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-primary" onClick={() => openModal()}>
                        <Plus size={18} /> Add {getTabLabel()}
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card green">
                    <div className="stat-icon"><ActiveIcon size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{data.length}</span>
                        <span className="stat-label">Total {getTabLabel()}s</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs-scroll">
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
            </div>

            {/* Table */}
            {renderTable()}

            {/* Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={`${formData.id ? 'Edit' : 'Add'} ${getTabLabel()}`}>
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
