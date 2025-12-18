import { useState, useEffect } from 'react';
import {
    Plus, Edit, Trash2, Award, ArrowRightLeft, UserMinus, Plane, TrendingUp,
    AlertTriangle, AlertCircle, XCircle, Megaphone, CalendarOff, CheckCircle
} from 'lucide-react';
import hrAdminService from '../services/hrAdminService';
import Modal from '../components/Modal';
import './HRAdmin.css';

export default function HRAdmin() {
    const [activeTab, setActiveTab] = useState('awards');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({});

    const tabs = [
        { key: 'awards', label: 'Awards', icon: Award },
        { key: 'transfers', label: 'Transfers', icon: ArrowRightLeft },
        { key: 'resignations', label: 'Resignations', icon: UserMinus },
        { key: 'trips', label: 'Trips', icon: Plane },
        { key: 'promotions', label: 'Promotions', icon: TrendingUp },
        { key: 'complaints', label: 'Complaints', icon: AlertTriangle },
        { key: 'warnings', label: 'Warnings', icon: AlertCircle },
        { key: 'terminations', label: 'Terminations', icon: XCircle },
        { key: 'announcements', label: 'Announcements', icon: Megaphone },
        { key: 'holidays', label: 'Holidays', icon: CalendarOff },
    ];

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            let res;
            switch (activeTab) {
                case 'awards': res = await hrAdminService.getAwards(); break;
                case 'transfers': res = await hrAdminService.getTransfers(); break;
                case 'resignations': res = await hrAdminService.getResignations(); break;
                case 'trips': res = await hrAdminService.getTrips(); break;
                case 'promotions': res = await hrAdminService.getPromotions(); break;
                case 'complaints': res = await hrAdminService.getComplaints(); break;
                case 'warnings': res = await hrAdminService.getWarnings(); break;
                case 'terminations': res = await hrAdminService.getTerminations(); break;
                case 'announcements': res = await hrAdminService.getAnnouncements(); break;
                case 'holidays': res = await hrAdminService.getHolidays(); break;
                default: res = { data: { data: [] } };
            }
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
            const service = hrAdminService;
            const tabSingular = activeTab.slice(0, -1); // awards -> award

            if (formData.id) {
                await service[`update${capitalize(tabSingular)}`](formData.id, formData);
            } else {
                await service[`create${capitalize(tabSingular)}`](formData);
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
            const tabSingular = activeTab.slice(0, -1);
            await hrAdminService[`delete${capitalize(tabSingular)}`](id);
            loadData();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleApprove = async (id) => {
        try {
            const tabSingular = activeTab.slice(0, -1);
            await hrAdminService[`approve${capitalize(tabSingular)}`](id);
            loadData();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleReject = async (id) => {
        const reason = prompt('Enter rejection reason:');
        if (!reason) return;
        try {
            const tabSingular = activeTab.slice(0, -1);
            await hrAdminService[`reject${capitalize(tabSingular)}`](id, reason);
            loadData();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    const getStatusBadge = (status) => {
        const badges = {
            pending: 'badge-warning',
            approved: 'badge-success',
            rejected: 'badge-danger',
            resolved: 'badge-success',
            active: 'badge-success',
        };
        return badges[status] || 'badge-secondary';
    };

    const renderTable = () => {
        if (loading) return <div className="loading">Loading...</div>;
        if (data.length === 0) return <div className="empty-state"><p>No records found</p></div>;

        return (
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Employee</th>
                            {activeTab === 'awards' && <><th>Award</th><th>Date</th></>}
                            {activeTab === 'transfers' && <><th>From Branch</th><th>To Branch</th><th>Date</th></>}
                            {activeTab === 'resignations' && <><th>Notice Date</th><th>Last Working</th><th>Reason</th></>}
                            {activeTab === 'trips' && <><th>Destination</th><th>Start Date</th><th>End Date</th></>}
                            {activeTab === 'promotions' && <><th>From</th><th>To</th><th>Date</th></>}
                            {activeTab === 'complaints' && <><th>Against</th><th>Title</th><th>Date</th></>}
                            {activeTab === 'warnings' && <><th>Subject</th><th>Date</th></>}
                            {activeTab === 'terminations' && <><th>Type</th><th>Date</th><th>Notice</th></>}
                            {activeTab === 'announcements' && <><th>Title</th><th>Start</th><th>End</th></>}
                            {activeTab === 'holidays' && <><th>Name</th><th>Date</th></>}
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td>
                                    <div className="employee-cell">
                                        <div className="avatar">{item.staff_member?.full_name?.charAt(0) || 'E'}</div>
                                        <span>{item.staff_member?.full_name || item.employee?.name || item.title || '-'}</span>
                                    </div>
                                </td>
                                {activeTab === 'awards' && (
                                    <>
                                        <td>{item.award_type?.name || '-'}</td>
                                        <td>{item.date ? new Date(item.date).toLocaleDateString() : '-'}</td>
                                    </>
                                )}
                                {activeTab === 'transfers' && (
                                    <>
                                        <td>{item.from_branch?.name || '-'}</td>
                                        <td>{item.to_branch?.name || '-'}</td>
                                        <td>{item.transfer_date ? new Date(item.transfer_date).toLocaleDateString() : '-'}</td>
                                    </>
                                )}
                                {activeTab === 'resignations' && (
                                    <>
                                        <td>{item.notice_date ? new Date(item.notice_date).toLocaleDateString() : '-'}</td>
                                        <td>{item.resignation_date ? new Date(item.resignation_date).toLocaleDateString() : '-'}</td>
                                        <td className="truncate">{item.reason || '-'}</td>
                                    </>
                                )}
                                {activeTab === 'trips' && (
                                    <>
                                        <td>{item.destination || '-'}</td>
                                        <td>{item.start_date ? new Date(item.start_date).toLocaleDateString() : '-'}</td>
                                        <td>{item.end_date ? new Date(item.end_date).toLocaleDateString() : '-'}</td>
                                    </>
                                )}
                                {activeTab === 'promotions' && (
                                    <>
                                        <td>{item.from_designation?.name || '-'}</td>
                                        <td>{item.to_designation?.name || '-'}</td>
                                        <td>{item.promotion_date ? new Date(item.promotion_date).toLocaleDateString() : '-'}</td>
                                    </>
                                )}
                                {activeTab === 'complaints' && (
                                    <>
                                        <td>{item.complaint_against?.full_name || '-'}</td>
                                        <td>{item.title || '-'}</td>
                                        <td>{item.complaint_date ? new Date(item.complaint_date).toLocaleDateString() : '-'}</td>
                                    </>
                                )}
                                {activeTab === 'warnings' && (
                                    <>
                                        <td>{item.subject || '-'}</td>
                                        <td>{item.warning_date ? new Date(item.warning_date).toLocaleDateString() : '-'}</td>
                                    </>
                                )}
                                {activeTab === 'terminations' && (
                                    <>
                                        <td>{item.termination_type?.name || '-'}</td>
                                        <td>{item.termination_date ? new Date(item.termination_date).toLocaleDateString() : '-'}</td>
                                        <td>{item.notice_date ? new Date(item.notice_date).toLocaleDateString() : '-'}</td>
                                    </>
                                )}
                                {activeTab === 'announcements' && (
                                    <>
                                        <td>{item.title || '-'}</td>
                                        <td>{item.start_date ? new Date(item.start_date).toLocaleDateString() : '-'}</td>
                                        <td>{item.end_date ? new Date(item.end_date).toLocaleDateString() : '-'}</td>
                                    </>
                                )}
                                {activeTab === 'holidays' && (
                                    <>
                                        <td>{item.occasion || item.name || '-'}</td>
                                        <td>{item.date ? new Date(item.date).toLocaleDateString() : '-'}</td>
                                    </>
                                )}
                                <td>
                                    <span className={`badge ${getStatusBadge(item.status)}`}>{item.status || 'active'}</span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        {item.status === 'pending' && ['transfers', 'resignations', 'trips'].includes(activeTab) && (
                                            <>
                                                <button className="btn btn-sm btn-success" onClick={() => handleApprove(item.id)} title="Approve">
                                                    <CheckCircle size={14} />
                                                </button>
                                                <button className="btn btn-sm btn-danger" onClick={() => handleReject(item.id)} title="Reject">
                                                    <XCircle size={14} />
                                                </button>
                                            </>
                                        )}
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
            case 'awards':
                return (
                    <>
                        <div className="form-group">
                            <label>Employee ID *</label>
                            <input type="number" value={formData.staff_member_id || ''} onChange={(e) => setFormData({ ...formData, staff_member_id: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Award Type ID *</label>
                            <input type="number" value={formData.award_type_id || ''} onChange={(e) => setFormData({ ...formData, award_type_id: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Date *</label>
                            <input type="date" value={formData.date || ''} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Gift</label>
                            <input type="text" value={formData.gift || ''} onChange={(e) => setFormData({ ...formData, gift: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3}></textarea>
                        </div>
                    </>
                );
            case 'announcements':
                return (
                    <>
                        <div className="form-group">
                            <label>Title *</label>
                            <input type="text" value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Start Date *</label>
                                <input type="date" value={formData.start_date || ''} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>End Date *</label>
                                <input type="date" value={formData.end_date || ''} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4}></textarea>
                        </div>
                    </>
                );
            case 'holidays':
                return (
                    <>
                        <div className="form-group">
                            <label>Occasion/Name *</label>
                            <input type="text" value={formData.occasion || ''} onChange={(e) => setFormData({ ...formData, occasion: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Date *</label>
                            <input type="date" value={formData.date || ''} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                        </div>
                    </>
                );
            default:
                return (
                    <>
                        <div className="form-group">
                            <label>Employee ID *</label>
                            <input type="number" value={formData.staff_member_id || ''} onChange={(e) => setFormData({ ...formData, staff_member_id: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Date *</label>
                            <input type="date" value={formData.date || formData[`${activeTab.slice(0, -1)}_date`] || ''} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3}></textarea>
                        </div>
                    </>
                );
        }
    };

    const ActiveIcon = tabs.find(t => t.key === activeTab)?.icon || Award;

    return (
        <div className="hr-admin-page">
            <div className="page-header">
                <div>
                    <h1>HR Admin</h1>
                    <p className="breadcrumb">HR Management &gt; HR Admin</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-primary" onClick={() => openModal()}>
                        <Plus size={18} /> Add {capitalize(activeTab.slice(0, -1))}
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card purple">
                    <div className="stat-icon"><ActiveIcon size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{data.length}</span>
                        <span className="stat-label">Total {capitalize(activeTab)}</span>
                    </div>
                </div>
            </div>

            {/* Tabs - Horizontal scroll for many tabs */}
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
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={`${formData.id ? 'Edit' : 'Add'} ${capitalize(activeTab.slice(0, -1))}`}>
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
