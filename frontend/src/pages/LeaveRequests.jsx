import { useEffect, useState } from 'react';
import { Plus, Calendar, Check, X, Clock, CalendarDays, CalendarOff, Search, Filter } from 'lucide-react';
import { leaveService } from '../services/leaveService';
import Modal from '../components/Modal';
import './LeaveRequests.css';

export default function LeaveRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({});
    const [leaveTypes, setLeaveTypes] = useState([]);

    useEffect(() => {
        fetchData();
    }, [filter]);

    const fetchData = async () => {
        try {
            const params = filter !== 'all' ? { status: filter } : {};
            const [reqRes, typesRes] = await Promise.all([
                leaveService.getRequests(params),
                leaveService.getLeaveTypes?.() || Promise.resolve({ data: { data: [] } })
            ]);
            setRequests(reqRes.data.data?.data || reqRes.data.data || []);
            setLeaveTypes(typesRes.data.data || []);
        } catch (error) {
            console.error('Fetch requests error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await leaveService.processRequest(id, 'approved', 'Approved');
            fetchData();
        } catch (error) {
            alert('Error approving request');
        }
    };

    const handleDecline = async (id) => {
        const remarks = prompt('Enter decline reason:');
        if (remarks) {
            try {
                await leaveService.processRequest(id, 'declined', remarks);
                fetchData();
            } catch (error) {
                alert('Error declining request');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await leaveService.createRequest(formData);
            setShowModal(false);
            setFormData({});
            fetchData();
        } catch (error) {
            alert('Error creating request');
        }
    };

    const stats = {
        pending: requests.filter(r => r.approval_status === 'pending').length,
        approved: requests.filter(r => r.approval_status === 'approved').length,
        declined: requests.filter(r => r.approval_status === 'declined' || r.approval_status === 'rejected').length,
        total: requests.length
    };

    return (
        <div className="leave-page">
            <div className="page-header">
                <div>
                    <h1>Leave Management</h1>
                    <p className="breadcrumb">Leave & Attendance &gt; Leave</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        <Plus size={16} />
                        Apply Leave
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card blue" onClick={() => setFilter('all')}>
                    <div className="stat-icon"><Calendar size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.total}</span>
                        <span className="stat-label">Total Requests</span>
                    </div>
                </div>
                <div className="stat-card orange" onClick={() => setFilter('pending')}>
                    <div className="stat-icon"><Clock size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.pending}</span>
                        <span className="stat-label">Pending</span>
                    </div>
                </div>
                <div className="stat-card green" onClick={() => setFilter('approved')}>
                    <div className="stat-icon"><CalendarDays size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.approved}</span>
                        <span className="stat-label">Approved</span>
                    </div>
                </div>
                <div className="stat-card red" onClick={() => setFilter('declined')}>
                    <div className="stat-icon"><CalendarOff size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.declined}</span>
                        <span className="stat-label">Declined</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs">
                <button className={`tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
                    All Requests
                </button>
                <button className={`tab ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>
                    Pending
                </button>
                <button className={`tab ${filter === 'approved' ? 'active' : ''}`} onClick={() => setFilter('approved')}>
                    Approved
                </button>
                <button className={`tab ${filter === 'declined' ? 'active' : ''}`} onClick={() => setFilter('declined')}>
                    Declined
                </button>
            </div>

            {/* Table */}
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Employee</th>
                            <th>Leave Type</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Days</th>
                            <th>Reason</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="9" className="empty-row">Loading...</td></tr>
                        ) : requests.length === 0 ? (
                            <tr><td colSpan="9" className="empty-row">No leave requests found</td></tr>
                        ) : (
                            requests.map((req, index) => (
                                <tr key={req.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="employee-cell">
                                            <div className="avatar">{req.staff_member?.full_name?.charAt(0) || 'E'}</div>
                                            <span>{req.staff_member?.full_name || 'Employee'}</span>
                                        </div>
                                    </td>
                                    <td><span className="badge badge-info">{req.category?.title || req.leave_type?.name || 'Leave'}</span></td>
                                    <td>{req.start_date}</td>
                                    <td>{req.end_date}</td>
                                    <td><strong>{req.total_days || 1}</strong></td>
                                    <td className="reason-cell">{req.reason || '-'}</td>
                                    <td>
                                        <span className={`badge ${req.approval_status === 'approved' ? 'badge-success' : req.approval_status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>
                                            {req.approval_status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            {req.approval_status === 'pending' && (
                                                <>
                                                    <button onClick={() => handleApprove(req.id)} className="btn btn-icon btn-sm btn-success" title="Approve">
                                                        <Check size={14} />
                                                    </button>
                                                    <button onClick={() => handleDecline(req.id)} className="btn btn-icon btn-sm btn-danger" title="Decline">
                                                        <X size={14} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Apply Leave Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Apply for Leave">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Leave Type *</label>
                        <select value={formData.leave_type_id || ''} onChange={(e) => setFormData({ ...formData, leave_type_id: e.target.value })} required>
                            <option value="">Select Leave Type</option>
                            {leaveTypes.map(type => (
                                <option key={type.id} value={type.id}>{type.name || type.title}</option>
                            ))}
                        </select>
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
                        <label>Reason *</label>
                        <textarea value={formData.reason || ''} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} rows={3} required></textarea>
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Submit Request</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
