import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, Clock, Calendar, Building, Briefcase, LogOut, Menu, X,
    DollarSign, FileText, ChevronDown, Settings, Award, UserCheck,
    CalendarDays, FolderOpen, Video, Package, BookOpen, ClipboardList, UserPlus,
    Timer, BarChart3, ShieldCheck, Megaphone, TrendingUp, Image, Wrench, Shield,
    FolderCog, Globe, Key, Bell
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { authService } from '../services/authService';
import ThemeToggle from './ThemeToggle';
import './Layout.css';

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [expandedMenus, setExpandedMenus] = useState(['hr-management']);
    const navigate = useNavigate();
    const user = authService.getCurrentUser();

    // Role-based access helper
    const hasAccess = (requiredRoles) => {
        if (!user?.role) return false;
        if (user.role === 'administrator') return true;
        return requiredRoles.includes(user.role);
    };

    // Permission-based access helper
    const hasPermission = (permission) => {
        if (!user) return false;
        if (user.role === 'administrator') return true;
        return user.permissions?.includes(permission);
    };

    const handleLogout = async () => {
        await authService.logout();
        navigate('/login');
    };

    const toggleMenu = (menuKey) => {
        setExpandedMenus(prev =>
            prev.includes(menuKey)
                ? prev.filter(m => m !== menuKey)
                : [...prev, menuKey]
        );
    };

    // Full navigation structure with role requirements
    const allNavItems = [
        {
            path: '/',
            icon: LayoutDashboard,
            label: 'Dashboard',
            roles: ['administrator', 'hr_officer', 'manager', 'staff_member']
        },
        {
            key: 'staff',
            icon: Users,
            label: 'Staff',
            roles: ['administrator'],
            children: [
                { path: '/users', label: 'Users & Roles' },
                { path: '/activity-log', label: 'Activity Log' },
            ]
        },
        {
            key: 'hr-management',
            icon: Building,
            label: 'HR Management',
            roles: ['administrator', 'hr_officer', 'manager'],
            children: [
                { path: '/organization', label: 'Organization' },
                { path: '/organization-chart', label: 'Organization Chart' },
                { path: '/staff', label: 'Employees' },
                { path: '/performance', label: 'Performance' },
                { path: '/assets', label: 'Asset Management' },
                { path: '/training', label: 'Training Management' },
            ]
        },
        {
            key: 'hr-admin',
            icon: ShieldCheck,
            label: 'HR Admin',
            roles: ['administrator', 'hr_officer'],
            children: [
                { path: '/hr-admin', label: 'Awards & Actions' },
                { path: '/announcements', label: 'Announcements' },
                { path: '/holidays', label: 'Holidays' },
                { path: '/events', label: 'Events' },
                { path: '/company-policy', label: 'Company Policy' },
            ]
        },
        {
            key: 'recruitment',
            icon: UserPlus,
            label: 'Recruitment',
            roles: ['administrator', 'hr_officer'],
            children: [
                { path: '/recruitment', label: 'Jobs & Candidates' },
                { path: '/onboarding', label: 'Onboarding' },
            ]
        },
        {
            path: '/contracts',
            icon: ClipboardList,
            label: 'Contracts',
            roles: ['administrator', 'hr_officer']
        },
        {
            path: '/documents',
            icon: FolderOpen,
            label: 'Documents',
            roles: ['administrator', 'hr_officer', 'manager', 'staff_member']
        },
        {
            path: '/meetings',
            icon: Video,
            label: 'Meetings',
            roles: ['administrator', 'hr_officer', 'manager', 'staff_member']
        },
        {
            path: '/calendar',
            icon: Calendar,
            label: 'Calendar',
            roles: ['administrator', 'hr_officer', 'manager', 'staff_member']
        },
        {
            path: '/media',
            icon: Image,
            label: 'Media Library',
            roles: ['administrator', 'hr_officer']
        },
        {
            key: 'leave-attendance',
            icon: CalendarDays,
            label: 'Leave & Attendance',
            roles: ['administrator', 'hr_officer', 'manager', 'staff_member'],
            children: [
                { path: '/leave', label: 'Leave Management' },
                { path: '/attendance', label: 'Attendance' },
                { path: '/shifts', label: 'Shift Management', roles: ['administrator', 'hr_officer', 'manager'] },
            ]
        },
        {
            key: 'time-tracking',
            icon: Timer,
            label: 'Time Tracking',
            roles: ['administrator', 'hr_officer', 'manager', 'staff_member'],
            children: [
                { path: '/timesheets', label: 'Timesheets' },
                { path: '/projects', label: 'Projects' },
            ]
        },
        {
            key: 'payroll',
            icon: DollarSign,
            label: 'Payroll',
            roles: ['administrator', 'hr_officer'],
            children: [
                { path: '/payroll', label: 'Payslips & Salary' },
                { path: '/payroll-setup', label: 'Payroll Setup' },
            ]
        },
        {
            path: '/reports',
            icon: BarChart3,
            label: 'Reports',
            roles: ['administrator', 'hr_officer', 'manager']
        },
        {
            path: '/configuration',
            icon: FolderCog,
            label: 'Configuration',
            roles: ['administrator', 'hr_officer']
        },
        {
            path: '/settings',
            icon: Settings,
            label: 'Settings',
            roles: ['administrator']
        },
    ];

    // Filter navigation items based on user role
    const navItems = useMemo(() => {
        return allNavItems
            .filter(item => hasAccess(item.roles))
            .map(item => {
                if (item.children) {
                    const filteredChildren = item.children.filter(child =>
                        !child.roles || hasAccess(child.roles)
                    );
                    return { ...item, children: filteredChildren };
                }
                return item;
            })
            .filter(item => !item.children || item.children.length > 0);
    }, [user?.role]);

    const renderNavItem = (item) => {
        if (item.children) {
            const isExpanded = expandedMenus.includes(item.key);
            const Icon = item.icon;
            return (
                <div key={item.key} className="nav-group">
                    <button
                        className={`nav-item nav-group-toggle ${isExpanded ? 'expanded' : ''}`}
                        onClick={() => toggleMenu(item.key)}
                    >
                        <Icon size={20} />
                        {sidebarOpen && (
                            <>
                                <span>{item.label}</span>
                                <ChevronDown size={16} className={`chevron ${isExpanded ? 'rotated' : ''}`} />
                            </>
                        )}
                    </button>
                    {isExpanded && sidebarOpen && (
                        <div className="nav-children">
                            {item.children.map(child => (
                                <NavLink
                                    key={child.path}
                                    to={child.path}
                                    className={({ isActive }) => `nav-item nav-child ${isActive ? 'active' : ''}`}
                                >
                                    <span>{child.label}</span>
                                </NavLink>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        const Icon = item.icon;
        return (
            <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                end={item.path === '/'}
            >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
        );
    };

    // Get role display name
    const getRoleDisplay = () => {
        if (user?.role_display) return user.role_display;
        const roleNames = {
            administrator: 'Super Admin',
            hr_officer: 'HR Manager',
            manager: 'Department Head',
            staff_member: 'Employee'
        };
        return roleNames[user?.role] || 'User';
    };

    return (
        <div className="layout">
            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <div className="logo">
                        <div className="logo-icon">
                            <Briefcase size={24} />
                        </div>
                        {sidebarOpen && <span className="logo-text">WorkDo HRM</span>}
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map(item => renderNavItem(item))}
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="nav-item logout-btn">
                        <LogOut size={20} />
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="main-content">
                {/* Top Header */}
                <header className="top-header">
                    <button
                        className="toggle-btn"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <div className="header-right">
                        <ThemeToggle />

                        <button className="btn btn-ghost btn-icon" title="Notifications">
                            <Bell size={20} />
                        </button>

                        <div className="user-info">
                            <span className="user-name">{user?.name || 'User'}</span>
                            <span className="user-role">{getRoleDisplay()}</span>
                        </div>
                        <div className="user-avatar">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
