import { useState, useEffect } from 'react';
import { Clock, Calendar as CalendarIcon, Users, UserCheck, UserX, Filter, Download, Upload, Search } from 'lucide-react';
import { attendanceService } from '../services/attendanceService';
import './Attendance.css';

export default function Attendance() {
    const [loading, setLoading] = useState(false);
    const [clockedIn, setClockedIn] = useState(false);
    const [clockInTime, setClockInTime] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [activeTab, setActiveTab] = useState('daily');
    const [stats, setStats] = useState({ present: 0, absent: 0, late: 0, leave: 0, total: 0 });
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        loadAttendance();
    }, [selectedDate]);

    const loadAttendance = async () => {
        try {
            const res = await attendanceService.getAttendance({ date: selectedDate });
            setAttendance(res.data.data?.data || res.data.data || []);
            setStats({
                present: attendance.filter(a => a.status === 'present').length || 0,
                absent: attendance.filter(a => a.status === 'absent').length || 0,
                late: attendance.filter(a => a.status === 'late').length || 0,
                leave: attendance.filter(a => a.status === 'leave').length || 0,
                total: attendance.length || 0
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleClockIn = async () => {
        setLoading(true);
        try {
            const response = await attendanceService.clockIn();
            if (response.data.success) {
                setClockedIn(true);
                setClockInTime(new Date().toLocaleTimeString());
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Error clocking in');
        } finally {
            setLoading(false);
        }
    };

    const handleClockOut = async () => {
        setLoading(true);
        try {
            const response = await attendanceService.clockOut();
            if (response.data.success) {
                setClockedIn(false);
                setClockInTime(null);
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Error clocking out');
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { key: 'daily', label: 'Daily Attendance' },
        { key: 'monthly', label: 'Monthly Report' },
        { key: 'bulk', label: 'Bulk Attendance' },
    ];

    return (
        <div className="attendance-page">
            <div className="page-header">
                <div>
                    <h1>Attendance</h1>
                    <p className="breadcrumb">Leave & Attendance &gt; Attendance</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-outline">
                        <Upload size={16} /> Import
                    </button>
                    <button className="btn btn-outline">
                        <Download size={16} /> Export
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card blue">
                    <div className="stat-icon"><Users size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.total}</span>
                        <span className="stat-label">Total Employees</span>
                    </div>
                </div>
                <div className="stat-card green">
                    <div className="stat-icon"><UserCheck size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.present}</span>
                        <span className="stat-label">Present</span>
                    </div>
                </div>
                <div className="stat-card orange">
                    <div className="stat-icon"><Clock size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.late}</span>
                        <span className="stat-label">Late</span>
                    </div>
                </div>
                <div className="stat-card red">
                    <div className="stat-icon"><UserX size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.absent}</span>
                        <span className="stat-label">Absent</span>
                    </div>
                </div>
            </div>

            {/* Clock In/Out Card */}
            <div className="clock-section">
                <div className="clock-card">
                    <div className="clock-display">
                        <Clock size={40} />
                        <h2>{currentTime.toLocaleTimeString()}</h2>
                        <p>{currentTime.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</p>
                    </div>
                    <div className="clock-actions">
                        {clockedIn ? (
                            <>
                                <span className="clock-status-badge clocked-in">
                                    <span className="pulse-dot"></span>
                                    Clocked In at {clockInTime}
                                </span>
                                <button onClick={handleClockOut} className="btn btn-danger" disabled={loading}>
                                    <Clock size={18} /> Clock Out
                                </button>
                            </>
                        ) : (
                            <>
                                <span className="clock-status-badge">Not Clocked In</span>
                                <button onClick={handleClockIn} className="btn btn-success" disabled={loading}>
                                    <Clock size={18} /> Clock In
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        className={`tab ${activeTab === tab.key ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Toolbar */}
            <div className="toolbar">
                <div className="search-box">
                    <Search size={18} />
                    <input type="text" placeholder="Search employees..." />
                </div>
                <div className="toolbar-right">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="date-input"
                    />
                </div>
            </div>

            {/* Attendance Table */}
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Employee</th>
                            <th>Date</th>
                            <th>Clock In</th>
                            <th>Clock Out</th>
                            <th>Total Hours</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendance.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="empty-row">
                                    No attendance records for this date
                                </td>
                            </tr>
                        ) : (
                            attendance.map((record, index) => (
                                <tr key={record.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="employee-cell">
                                            <div className="avatar">{record.staff_member?.full_name?.charAt(0) || 'E'}</div>
                                            <span>{record.staff_member?.full_name || 'Employee'}</span>
                                        </div>
                                    </td>
                                    <td>{record.date}</td>
                                    <td>{record.clock_in || '-'}</td>
                                    <td>{record.clock_out || '-'}</td>
                                    <td>{record.hours || '-'}</td>
                                    <td>
                                        <span className={`badge badge-${record.status === 'present' ? 'success' : record.status === 'late' ? 'warning' : 'danger'}`}>
                                            {record.status || 'N/A'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
