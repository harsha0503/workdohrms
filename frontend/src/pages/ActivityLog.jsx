import { useState, useEffect } from 'react';
import { Activity, Filter, Search, Calendar, User, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { userService } from '../services/userService';
import './ActivityLog.css';

export default function ActivityLog() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        search: '',
        user_id: '',
        action_type: '',
        date_from: '',
        date_to: '',
    });

    useEffect(() => {
        loadLogs();
    }, [currentPage, filters]);

    const loadLogs = async () => {
        setLoading(true);
        try {
            const response = await userService.getAllActivityLogs?.({
                page: currentPage,
                ...filters
            });
            const data = response?.data?.data || [];
            setLogs(data.data || data);
            setTotalPages(data.last_page || 1);
        } catch (error) {
            console.error('Error:', error);
            // Mock data
            setLogs([
                { id: 1, user: { name: 'John Doe' }, action: 'login', description: 'User logged in', ip_address: '192.168.1.1', created_at: '2024-12-18 10:30:00' },
                { id: 2, user: { name: 'Jane Smith' }, action: 'create', description: 'Created employee: Mike Johnson', ip_address: '192.168.1.2', created_at: '2024-12-18 10:15:00' },
                { id: 3, user: { name: 'Admin' }, action: 'update', description: 'Updated attendance settings', ip_address: '192.168.1.1', created_at: '2024-12-18 09:45:00' },
                { id: 4, user: { name: 'John Doe' }, action: 'approve', description: 'Approved leave request #124', ip_address: '192.168.1.1', created_at: '2024-12-18 09:30:00' },
                { id: 5, user: { name: 'Jane Smith' }, action: 'delete', description: 'Deleted document: Old Policy.pdf', ip_address: '192.168.1.2', created_at: '2024-12-17 16:00:00' },
                { id: 6, user: { name: 'Admin' }, action: 'export', description: 'Exported employee list', ip_address: '192.168.1.1', created_at: '2024-12-17 15:30:00' },
                { id: 7, user: { name: 'Mike Johnson' }, action: 'login', description: 'User logged in', ip_address: '192.168.1.5', created_at: '2024-12-17 14:00:00' },
                { id: 8, user: { name: 'Admin' }, action: 'create', description: 'Created new role: Supervisor', ip_address: '192.168.1.1', created_at: '2024-12-17 11:00:00' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const getActionColor = (action) => {
        const colors = {
            login: 'blue',
            logout: 'gray',
            create: 'green',
            update: 'orange',
            delete: 'red',
            approve: 'green',
            reject: 'red',
            export: 'purple',
            import: 'purple',
        };
        return colors[action?.toLowerCase()] || 'gray';
    };

    const getActionIcon = (action) => {
        return <Activity size={14} />;
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleString();
    };

    return (
        <div className="activity-log-page">
            <div className="page-header">
                <div>
                    <h1>Activity Log</h1>
                    <p className="breadcrumb">System &gt; Activity Log</p>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-card">
                <div className="filters-row">
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search activities..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                    </div>
                    <select
                        value={filters.action_type}
                        onChange={(e) => setFilters({ ...filters, action_type: e.target.value })}
                    >
                        <option value="">All Actions</option>
                        <option value="login">Login</option>
                        <option value="logout">Logout</option>
                        <option value="create">Create</option>
                        <option value="update">Update</option>
                        <option value="delete">Delete</option>
                        <option value="approve">Approve</option>
                        <option value="reject">Reject</option>
                        <option value="export">Export</option>
                    </select>
                    <input
                        type="date"
                        value={filters.date_from}
                        onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
                        placeholder="From Date"
                    />
                    <input
                        type="date"
                        value={filters.date_to}
                        onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
                        placeholder="To Date"
                    />
                    <button className="btn btn-secondary" onClick={loadLogs}>
                        <Filter size={16} /> Filter
                    </button>
                </div>
            </div>

            {/* Activity Timeline */}
            {loading ? (
                <div className="loading">Loading activity logs...</div>
            ) : (
                <div className="activity-timeline">
                    {logs.length === 0 ? (
                        <div className="empty-state">
                            <Activity size={48} />
                            <p>No activity logs found</p>
                        </div>
                    ) : (
                        logs.map((log, index) => (
                            <div key={log.id} className="activity-item">
                                <div className={`activity-indicator ${getActionColor(log.action)}`}>
                                    {getActionIcon(log.action)}
                                </div>
                                <div className="activity-content">
                                    <div className="activity-header">
                                        <span className={`action-badge ${getActionColor(log.action)}`}>
                                            {log.action?.toUpperCase()}
                                        </span>
                                        <span className="activity-time">
                                            <Clock size={12} /> {formatDate(log.created_at)}
                                        </span>
                                    </div>
                                    <p className="activity-description">{log.description}</p>
                                    <div className="activity-meta">
                                        <span><User size={12} /> {log.user?.name || 'System'}</span>
                                        <span>IP: {log.ip_address || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft size={16} /> Previous
                    </button>
                    <span className="page-info">Page {currentPage} of {totalPages}</span>
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Next <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}
