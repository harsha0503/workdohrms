import { useEffect, useState } from 'react';
import { Plus, Search, Download, Upload, Edit2, Trash2, Eye, Grid, List, Filter, Users } from 'lucide-react';
import { staffService } from '../services/staffService';
import { Link } from 'react-router-dom';
import './StaffMembers.css';

export default function StaffMembers() {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [viewMode, setViewMode] = useState('list');
    const [filterOpen, setFilterOpen] = useState(false);

    useEffect(() => {
        fetchStaff();
    }, [currentPage, search]);

    const fetchStaff = async () => {
        try {
            const response = await staffService.getStaff({
                page: currentPage,
                search,
                per_page: 15
            });
            // Handle various API response structures
            const data = response.data?.data?.data || response.data?.data || response.data || [];
            const lastPage = response.data?.data?.last_page || response.data?.last_page || 1;
            setStaff(Array.isArray(data) ? data : []);
            setTotalPages(lastPage);
        } catch (error) {
            console.error('Fetch staff error:', error);
            setStaff([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this staff member?')) {
            try {
                await staffService.deleteStaff(id);
                fetchStaff();
            } catch (error) {
                alert('Error deleting staff member');
            }
        }
    };

    const handleExport = async () => {
        try {
            const response = await staffService.exportStaff();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'employees.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert('Error exporting employees');
        }
    };

    const stats = {
        total: staff.length,
        active: staff.filter(s => s.employment_status === 'active' || !s.employment_status).length,
        inactive: staff.filter(s => s.employment_status === 'inactive').length,
    };

    return (
        <div className="staff-page">
            <div className="page-header">
                <div>
                    <h1>Employees</h1>
                    <p className="breadcrumb">HR Management &gt; Employees</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-outline" onClick={handleExport}>
                        <Download size={16} />
                        Export
                    </button>
                    <Link to="/staff/new" className="btn btn-primary">
                        <Plus size={16} />
                        Add Employee
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid mini">
                <div className="stat-card blue">
                    <div className="stat-icon"><Users size={20} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.total}</span>
                        <span className="stat-label">Total Employees</span>
                    </div>
                </div>
                <div className="stat-card green">
                    <div className="stat-icon"><Users size={20} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.active}</span>
                        <span className="stat-label">Active</span>
                    </div>
                </div>
                <div className="stat-card orange">
                    <div className="stat-icon"><Users size={20} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.inactive}</span>
                        <span className="stat-label">Inactive</span>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="toolbar">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search employees..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="toolbar-right">
                    <button className="btn btn-ghost" onClick={() => setFilterOpen(!filterOpen)}>
                        <Filter size={16} />
                        Filter
                    </button>
                    <div className="view-toggle">
                        <button
                            className={`btn btn-icon btn-ghost ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            <List size={18} />
                        </button>
                        <button
                            className={`btn btn-icon btn-ghost ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                        >
                            <Grid size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="loading">Loading...</div>
            ) : viewMode === 'list' ? (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Employee</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Designation</th>
                                <th>Joining Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staff.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="empty-row">No employees found</td>
                                </tr>
                            ) : (
                                staff.map((member, index) => (
                                    <tr key={member.id}>
                                        <td>{(currentPage - 1) * 15 + index + 1}</td>
                                        <td>
                                            <div className="employee-cell">
                                                <div className="avatar">
                                                    {member.avatar ? (
                                                        <img src={member.avatar} alt="" />
                                                    ) : (
                                                        member.full_name?.charAt(0) || 'E'
                                                    )}
                                                </div>
                                                <div>
                                                    <strong>{member.full_name}</strong>
                                                    <span className="emp-id">#{member.employee_id || member.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{member.email || '-'}</td>
                                        <td>{member.department?.name || member.division?.title || '-'}</td>
                                        <td>{member.designation?.name || member.job_title?.title || '-'}</td>
                                        <td>{member.joining_date || member.hire_date || '-'}</td>
                                        <td>
                                            <span className={`badge ${member.employment_status === 'inactive' ? 'badge-danger' : 'badge-success'}`}>
                                                {member.employment_status || 'Active'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <Link to={`/staff/${member.id}`} className="btn btn-icon btn-ghost btn-sm" title="View">
                                                    <Eye size={16} />
                                                </Link>
                                                <Link to={`/staff/${member.id}/edit`} className="btn btn-icon btn-ghost btn-sm" title="Edit">
                                                    <Edit2 size={16} />
                                                </Link>
                                                <button onClick={() => handleDelete(member.id)} className="btn btn-icon btn-ghost btn-sm text-danger" title="Delete">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="employees-grid">
                    {staff.map((member) => (
                        <div key={member.id} className="employee-card">
                            <div className="employee-card-header">
                                <div className="avatar lg">
                                    {member.avatar ? (
                                        <img src={member.avatar} alt="" />
                                    ) : (
                                        member.full_name?.charAt(0) || 'E'
                                    )}
                                </div>
                                <span className={`status-dot ${member.employment_status === 'inactive' ? 'inactive' : 'active'}`}></span>
                            </div>
                            <div className="employee-card-body">
                                <h3>{member.full_name}</h3>
                                <p className="designation">{member.designation?.name || member.job_title?.title || 'Employee'}</p>
                                <p className="department">{member.department?.name || member.division?.title || '-'}</p>
                                <p className="email">{member.email}</p>
                            </div>
                            <div className="employee-card-footer">
                                <Link to={`/staff/${member.id}`} className="btn btn-sm btn-primary">View Profile</Link>
                            </div>
                        </div>
                    ))}
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
                        Previous
                    </button>
                    <div className="page-numbers">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const page = i + 1;
                            return (
                                <button
                                    key={page}
                                    className={`page-btn ${currentPage === page ? 'active' : ''}`}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            );
                        })}
                    </div>
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
