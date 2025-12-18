import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Users, Clock, CalendarDays, DollarSign, TrendingUp, TrendingDown,
    UserCheck, UserMinus, FileText, Calendar, ArrowRight, Bell,
    Briefcase, Award, Gift, ChevronRight, BarChart3, Activity
} from 'lucide-react';
import api from '../services/api';
import './Dashboard.css';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        loadDashboard();

        // Set greeting based on time of day
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 17) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
    }, []);

    const loadDashboard = async () => {
        try {
            const response = await api.get('/dashboard');
            setStats(response.data.data);
        } catch (error) {
            console.error('Error loading dashboard:', error);
            // Use demo data
            setStats({
                employees: { total: 156, active: 148, new_this_month: 5, on_leave: 8 },
                attendance: { present: 132, absent: 8, late: 6, not_marked: 10 },
                leave_requests: { pending: 7, approved_this_month: 23 },
                payroll: { total_salary: 4250000, processed: 148, pending: 8 },
                upcoming_birthdays: [
                    { id: 1, name: 'Sarah Johnson', date: 'Dec 20', avatar: 'SJ' },
                    { id: 2, name: 'Michael Chen', date: 'Dec 22', avatar: 'MC' },
                    { id: 3, name: 'Emily Davis', date: 'Dec 25', avatar: 'ED' },
                ],
                recent_activities: [
                    { id: 1, action: 'Leave approved', user: 'John Smith', time: '5 mins ago', type: 'leave' },
                    { id: 2, action: 'New employee added', user: 'HR Admin', time: '1 hour ago', type: 'employee' },
                    { id: 3, action: 'Payslip generated', user: 'System', time: '2 hours ago', type: 'payroll' },
                    { id: 4, action: 'Attendance marked', user: 'Jane Doe', time: '3 hours ago', type: 'attendance' },
                ],
                upcoming_events: [
                    { id: 1, title: 'Team Meeting', date: 'Today, 3:00 PM' },
                    { id: 2, title: 'Year End Party', date: 'Dec 28, 6:00 PM' },
                ],
                announcements: [
                    { id: 1, title: 'Holiday Notice', content: 'Office will remain closed on Dec 25th' },
                ]
            });
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="dashboard animate-fade-in">
            {/* Welcome Header */}
            <div className="dashboard-header">
                <div className="welcome-section">
                    <h1>{greeting}! 👋</h1>
                    <p>Here's what's happening with your team today.</p>
                </div>
                <div className="header-actions">
                    <Link to="/staff/new" className="btn btn-primary">
                        <Users size={16} /> Add Employee
                    </Link>
                </div>
            </div>

            {/* Main Stats */}
            <div className="stats-grid four-cols">
                <div className="stat-card gradient-purple animate-slide-up" style={{ animationDelay: '0ms' }}>
                    <div className="stat-icon-wrapper">
                        <Users size={24} />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{stats.employees?.total || 0}</div>
                        <div className="stat-label">Total Employees</div>
                        <div className="stat-change positive">
                            <TrendingUp size={14} />
                            <span>+{stats.employees?.new_this_month || 0} this month</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card gradient-green animate-slide-up" style={{ animationDelay: '50ms' }}>
                    <div className="stat-icon-wrapper">
                        <UserCheck size={24} />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{stats.attendance?.present || 0}</div>
                        <div className="stat-label">Present Today</div>
                        <div className="stat-change neutral">
                            <Activity size={14} />
                            <span>{stats.attendance?.late || 0} late arrivals</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card gradient-orange animate-slide-up" style={{ animationDelay: '100ms' }}>
                    <div className="stat-icon-wrapper">
                        <CalendarDays size={24} />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{stats.leave_requests?.pending || 0}</div>
                        <div className="stat-label">Pending Leaves</div>
                        <div className="stat-change">
                            <ChevronRight size={14} />
                            <span>{stats.employees?.on_leave || 0} on leave</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card gradient-blue animate-slide-up" style={{ animationDelay: '150ms' }}>
                    <div className="stat-icon-wrapper">
                        <DollarSign size={24} />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{formatCurrency(stats.payroll?.total_salary || 0)}</div>
                        <div className="stat-label">Monthly Payroll</div>
                        <div className="stat-change positive">
                            <TrendingUp size={14} />
                            <span>{stats.payroll?.processed || 0} processed</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="dashboard-grid">
                {/* Quick Actions */}
                <div className="dashboard-card quick-actions-card animate-slide-up" style={{ animationDelay: '200ms' }}>
                    <div className="card-header">
                        <h3>Quick Actions</h3>
                    </div>
                    <div className="quick-actions-grid">
                        <Link to="/attendance" className="quick-action">
                            <div className="action-icon blue"><Clock size={20} /></div>
                            <span>Mark Attendance</span>
                        </Link>
                        <Link to="/leave" className="quick-action">
                            <div className="action-icon orange"><CalendarDays size={20} /></div>
                            <span>Leave Requests</span>
                        </Link>
                        <Link to="/payroll" className="quick-action">
                            <div className="action-icon green"><DollarSign size={20} /></div>
                            <span>Generate Payslips</span>
                        </Link>
                        <Link to="/reports" className="quick-action">
                            <div className="action-icon purple"><BarChart3 size={20} /></div>
                            <span>View Reports</span>
                        </Link>
                        <Link to="/recruitment" className="quick-action">
                            <div className="action-icon cyan"><Briefcase size={20} /></div>
                            <span>Recruitment</span>
                        </Link>
                        <Link to="/staff" className="quick-action">
                            <div className="action-icon yellow"><Users size={20} /></div>
                            <span>Employees</span>
                        </Link>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="dashboard-card activity-card animate-slide-up" style={{ animationDelay: '250ms' }}>
                    <div className="card-header">
                        <h3>Recent Activity</h3>
                        <Link to="/activity-log" className="view-all">
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="activity-list">
                        {stats.recent_activities?.map(activity => (
                            <div key={activity.id} className="activity-item">
                                <div className={`activity-icon ${activity.type}`}>
                                    {activity.type === 'leave' && <CalendarDays size={14} />}
                                    {activity.type === 'employee' && <Users size={14} />}
                                    {activity.type === 'payroll' && <DollarSign size={14} />}
                                    {activity.type === 'attendance' && <Clock size={14} />}
                                </div>
                                <div className="activity-content">
                                    <span className="activity-action">{activity.action}</span>
                                    <span className="activity-meta">{activity.user} • {activity.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Attendance Overview */}
                <div className="dashboard-card attendance-card animate-slide-up" style={{ animationDelay: '300ms' }}>
                    <div className="card-header">
                        <h3>Today's Attendance</h3>
                        <Link to="/attendance" className="view-all">
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="attendance-stats">
                        <div className="attendance-ring">
                            <svg viewBox="0 0 100 100">
                                <circle className="ring-bg" cx="50" cy="50" r="40" />
                                <circle
                                    className="ring-fill"
                                    cx="50" cy="50" r="40"
                                    strokeDasharray={`${(stats.attendance?.present / stats.employees?.active * 100 * 2.51) || 0} 251`}
                                />
                            </svg>
                            <div className="ring-value">
                                <span className="percentage">{Math.round((stats.attendance?.present / stats.employees?.active * 100) || 0)}%</span>
                                <span className="label">Present</span>
                            </div>
                        </div>
                        <div className="attendance-breakdown">
                            <div className="breakdown-item">
                                <span className="dot green"></span>
                                <span className="label">Present</span>
                                <span className="value">{stats.attendance?.present}</span>
                            </div>
                            <div className="breakdown-item">
                                <span className="dot red"></span>
                                <span className="label">Absent</span>
                                <span className="value">{stats.attendance?.absent}</span>
                            </div>
                            <div className="breakdown-item">
                                <span className="dot orange"></span>
                                <span className="label">Late</span>
                                <span className="value">{stats.attendance?.late}</span>
                            </div>
                            <div className="breakdown-item">
                                <span className="dot gray"></span>
                                <span className="label">Not Marked</span>
                                <span className="value">{stats.attendance?.not_marked}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upcoming Birthdays */}
                <div className="dashboard-card birthdays-card animate-slide-up" style={{ animationDelay: '350ms' }}>
                    <div className="card-header">
                        <h3><Gift size={18} /> Upcoming Birthdays</h3>
                    </div>
                    <div className="birthday-list">
                        {stats.upcoming_birthdays?.map(person => (
                            <div key={person.id} className="birthday-item">
                                <div className="avatar birthday-avatar">
                                    {person.avatar}
                                </div>
                                <div className="birthday-info">
                                    <span className="name">{person.name}</span>
                                    <span className="date">{person.date}</span>
                                </div>
                                <button className="btn btn-ghost btn-icon btn-sm">
                                    <Gift size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Announcements */}
                {stats.announcements?.length > 0 && (
                    <div className="dashboard-card announcements-card animate-slide-up" style={{ animationDelay: '400ms' }}>
                        <div className="card-header">
                            <h3><Bell size={18} /> Announcements</h3>
                            <Link to="/announcements" className="view-all">
                                View All <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="announcement-list">
                            {stats.announcements.map(announcement => (
                                <div key={announcement.id} className="announcement-item">
                                    <div className="announcement-badge">
                                        <Bell size={14} />
                                    </div>
                                    <div className="announcement-content">
                                        <h4>{announcement.title}</h4>
                                        <p>{announcement.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Upcoming Events */}
                <div className="dashboard-card events-card animate-slide-up" style={{ animationDelay: '450ms' }}>
                    <div className="card-header">
                        <h3><Calendar size={18} /> Upcoming Events</h3>
                        <Link to="/events" className="view-all">
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="events-list">
                        {stats.upcoming_events?.map(event => (
                            <div key={event.id} className="event-item">
                                <div className="event-date-badge">
                                    <Calendar size={14} />
                                </div>
                                <div className="event-info">
                                    <span className="event-title">{event.title}</span>
                                    <span className="event-date">{event.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
