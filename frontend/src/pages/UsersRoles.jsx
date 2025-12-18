import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Shield, Users, Search, MoreVertical, Eye, Key, Check, X } from 'lucide-react';
import { userService } from '../services/userService';
import Modal from '../components/Modal';
import './UsersRoles.css';

export default function UsersRoles() {
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('user');
    const [editingItem, setEditingItem] = useState(null);
    const [search, setSearch] = useState('');

    // Default user form
    const [userForm, setUserForm] = useState({
        name: '',
        email: '',
        password: '',
        role_id: '',
        status: 'active'
    });

    // Default role form
    const [roleForm, setRoleForm] = useState({
        name: '',
        description: '',
        permissions: []
    });

    const availablePermissions = [
        { group: 'Staff', permissions: ['staff.view', 'staff.create', 'staff.edit', 'staff.delete'] },
        { group: 'Attendance', permissions: ['attendance.view', 'attendance.manage', 'attendance.export'] },
        { group: 'Leave', permissions: ['leave.view', 'leave.create', 'leave.approve', 'leave.delete'] },
        { group: 'Payroll', permissions: ['payroll.view', 'payroll.manage', 'payroll.generate'] },
        { group: 'Recruitment', permissions: ['recruitment.view', 'recruitment.manage'] },
        { group: 'Reports', permissions: ['reports.view', 'reports.export'] },
        { group: 'Settings', permissions: ['settings.view', 'settings.manage'] },
    ];

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [usersRes, rolesRes] = await Promise.all([
                userService.getUsers?.() || { data: { data: [] } },
                userService.getRoles?.() || { data: { data: [] } }
            ]);
            setUsers(usersRes.data?.data || []);
            setRoles(rolesRes.data?.data || []);
        } catch (error) {
            console.error('Error loading data:', error);
            // Mock data for demo
            setUsers([
                { id: 1, name: 'Admin User', email: 'admin@hrms.local', role: { id: 1, name: 'Super Admin' }, status: 'active', last_login: '2024-12-18 10:30' },
                { id: 2, name: 'HR Manager', email: 'hr@hrms.local', role: { id: 2, name: 'HR Manager' }, status: 'active', last_login: '2024-12-18 09:15' },
                { id: 3, name: 'John Employee', email: 'john@hrms.local', role: { id: 3, name: 'Employee' }, status: 'active', last_login: '2024-12-17 16:45' },
                { id: 4, name: 'Jane Smith', email: 'jane@hrms.local', role: { id: 4, name: 'Department Head' }, status: 'active', last_login: '2024-12-18 08:00' },
                { id: 5, name: 'Mike Wilson', email: 'mike@hrms.local', role: { id: 5, name: 'Accountant' }, status: 'inactive', last_login: '2024-12-10 14:20' },
            ]);
            setRoles([
                { id: 1, name: 'Super Admin', description: 'Full system access', users_count: 1, permissions: ['all'] },
                { id: 2, name: 'HR Manager', description: 'HR operations management', users_count: 1, permissions: ['staff.view', 'staff.create', 'staff.edit', 'leave.approve', 'recruitment.manage'] },
                { id: 3, name: 'Employee', description: 'Basic employee access', users_count: 50, permissions: ['staff.view', 'leave.create', 'attendance.view'] },
                { id: 4, name: 'Department Head', description: 'Department management', users_count: 5, permissions: ['staff.view', 'leave.approve', 'reports.view'] },
                { id: 5, name: 'Accountant', description: 'Payroll and finance access', users_count: 3, permissions: ['payroll.view', 'payroll.manage', 'reports.view'] },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (type, item = null) => {
        setModalType(type);
        setEditingItem(item);
        if (type === 'user') {
            setUserForm(item ? {
                name: item.name,
                email: item.email,
                password: '',
                role_id: item.role?.id || '',
                status: item.status
            } : {
                name: '',
                email: '',
                password: '',
                role_id: '',
                status: 'active'
            });
        } else {
            setRoleForm(item ? {
                name: item.name,
                description: item.description,
                permissions: item.permissions || []
            } : {
                name: '',
                description: '',
                permissions: []
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalType === 'user') {
                if (editingItem) {
                    await userService.updateUser?.(editingItem.id, userForm);
                } else {
                    await userService.createUser?.(userForm);
                }
            } else {
                if (editingItem) {
                    await userService.updateRole?.(editingItem.id, roleForm);
                } else {
                    await userService.createRole?.(roleForm);
                }
            }
            setShowModal(false);
            loadData();
        } catch (error) {
            console.error('Error:', error);
            setShowModal(false);
        }
    };

    const handleDelete = async (type, id) => {
        if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
        try {
            if (type === 'user') {
                await userService.deleteUser?.(id);
            } else {
                await userService.deleteRole?.(id);
            }
            loadData();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const togglePermission = (permission) => {
        setRoleForm(prev => ({
            ...prev,
            permissions: prev.permissions.includes(permission)
                ? prev.permissions.filter(p => p !== permission)
                : [...prev.permissions, permission]
        }));
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="users-roles-page animate-fade-in">
            <div className="page-header">
                <div>
                    <h1>Users & Roles</h1>
                    <p className="breadcrumb">Staff &gt; Users & Roles Management</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-outline" onClick={() => openModal('role')}>
                        <Shield size={16} /> Add Role
                    </button>
                    <button className="btn btn-primary" onClick={() => openModal('user')}>
                        <Plus size={16} /> Add User
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    <Users size={16} /> Users ({users.length})
                </button>
                <button
                    className={`tab ${activeTab === 'roles' ? 'active' : ''}`}
                    onClick={() => setActiveTab('roles')}
                >
                    <Shield size={16} /> Roles ({roles.length})
                </button>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card blue">
                    <div className="stat-icon"><Users size={20} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{users.length}</span>
                        <span className="stat-label">Total Users</span>
                    </div>
                </div>
                <div className="stat-card green">
                    <div className="stat-icon"><Check size={20} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{users.filter(u => u.status === 'active').length}</span>
                        <span className="stat-label">Active Users</span>
                    </div>
                </div>
                <div className="stat-card purple">
                    <div className="stat-icon"><Shield size={20} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{roles.length}</span>
                        <span className="stat-label">Roles</span>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="loading"><div className="spinner"></div> Loading...</div>
            ) : (
                <>
                    {activeTab === 'users' && (
                        <>
                            {/* Search */}
                            <div className="toolbar">
                                <div className="toolbar-left">
                                    <div className="search-box">
                                        <Search size={18} />
                                        <input
                                            type="text"
                                            placeholder="Search users..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Users Table */}
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th>Last Login</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map(user => (
                                            <tr key={user.id}>
                                                <td>
                                                    <div className="employee-cell">
                                                        <div className="avatar">{user.name.charAt(0)}</div>
                                                        <span>{user.name}</span>
                                                    </div>
                                                </td>
                                                <td>{user.email}</td>
                                                <td>
                                                    <span className="badge badge-primary">{user.role?.name}</span>
                                                </td>
                                                <td>
                                                    <span className={`badge ${user.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="text-muted">{user.last_login}</td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openModal('user', user)}>
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button className="btn btn-ghost btn-icon btn-sm" title="Reset Password">
                                                            <Key size={14} />
                                                        </button>
                                                        <button className="btn btn-ghost btn-icon btn-sm text-danger" onClick={() => handleDelete('user', user.id)}>
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {activeTab === 'roles' && (
                        <div className="roles-grid">
                            {roles.map(role => (
                                <div key={role.id} className="role-card">
                                    <div className="role-header">
                                        <div className="role-icon">
                                            <Shield size={20} />
                                        </div>
                                        <div className="role-info">
                                            <h3>{role.name}</h3>
                                            <p>{role.description}</p>
                                        </div>
                                        <div className="role-actions">
                                            <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openModal('role', role)}>
                                                <Edit2 size={14} />
                                            </button>
                                            {role.name !== 'Super Admin' && (
                                                <button className="btn btn-ghost btn-icon btn-sm text-danger" onClick={() => handleDelete('role', role.id)}>
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="role-stats">
                                        <span><Users size={14} /> {role.users_count} users</span>
                                        <span><Key size={14} /> {role.permissions?.length || 0} permissions</span>
                                    </div>
                                    <div className="role-permissions">
                                        {(role.permissions || []).slice(0, 5).map(p => (
                                            <span key={p} className="badge">{p}</span>
                                        ))}
                                        {(role.permissions?.length || 0) > 5 && (
                                            <span className="badge">+{role.permissions.length - 5} more</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingItem ? `Edit ${modalType}` : `Add ${modalType}`} size="lg">
                <form onSubmit={handleSubmit}>
                    {modalType === 'user' ? (
                        <>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Full Name *</label>
                                    <input
                                        type="text"
                                        value={userForm.name}
                                        onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email *</label>
                                    <input
                                        type="email"
                                        value={userForm.email}
                                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>{editingItem ? 'New Password (leave blank to keep)' : 'Password *'}</label>
                                    <input
                                        type="password"
                                        value={userForm.password}
                                        onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                                        required={!editingItem}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Role *</label>
                                    <select
                                        value={userForm.role_id}
                                        onChange={(e) => setUserForm({ ...userForm, role_id: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Role</option>
                                        {roles.map(role => (
                                            <option key={role.id} value={role.id}>{role.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select
                                    value={userForm.status}
                                    onChange={(e) => setUserForm({ ...userForm, status: e.target.value })}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="form-group">
                                <label>Role Name *</label>
                                <input
                                    type="text"
                                    value={roleForm.name}
                                    onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={roleForm.description}
                                    onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                                    rows={2}
                                />
                            </div>
                            <div className="form-group">
                                <label>Permissions</label>
                                <div className="permissions-grid">
                                    {availablePermissions.map(group => (
                                        <div key={group.group} className="permission-group">
                                            <h4>{group.group}</h4>
                                            <div className="permission-list">
                                                {group.permissions.map(perm => (
                                                    <label key={perm} className="permission-item">
                                                        <input
                                                            type="checkbox"
                                                            checked={roleForm.permissions.includes(perm)}
                                                            onChange={() => togglePermission(perm)}
                                                        />
                                                        <span>{perm.split('.')[1]}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">{editingItem ? 'Update' : 'Create'}</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
