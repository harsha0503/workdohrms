import { useState, useEffect } from 'react';
import {
    BarChart3, Download, Filter, Calendar, Users, Clock, DollarSign,
    TrendingUp, FileText, PieChart, Activity, ArrowUp, ArrowDown
} from 'lucide-react';
import { reportsService } from '../services/reportsService';
import './Reports.css';

export default function Reports() {
    const [activeReport, setActiveReport] = useState('overview');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState(null);

    const reports = [
        { key: 'overview', label: 'Overview', icon: BarChart3 },
        { key: 'attendance', label: 'Attendance Report', icon: Clock },
        { key: 'leave', label: 'Leave Report', icon: Calendar },
        { key: 'payroll', label: 'Payroll Report', icon: DollarSign },
        { key: 'employee', label: 'Employee Report', icon: Users },
        { key: 'performance', label: 'Performance Report', icon: TrendingUp },
    ];

    useEffect(() => {
        loadReport();
    }, [activeReport, dateRange]);

    const loadReport = async () => {
        setLoading(true);
        try {
            let data;
            switch (activeReport) {
                case 'attendance':
                    data = await reportsService.getAttendanceReport(dateRange);
                    break;
                case 'leave':
                    data = await reportsService.getLeaveReport(dateRange);
                    break;
                case 'payroll':
                    data = await reportsService.getPayrollReport(dateRange);
                    break;
                case 'employee':
                    data = await reportsService.getEmployeeReport(dateRange);
                    break;
                case 'performance':
                    data = await reportsService.getPerformanceReport?.(dateRange) || { data: {} };
                    break;
                default:
                    data = await reportsService.getDashboardStats?.() || mockOverviewData();
            }
            setReportData(data.data?.data || data.data || mockOverviewData());
        } catch (error) {
            console.error('Error loading report:', error);
            setReportData(mockOverviewData());
        } finally {
            setLoading(false);
        }
    };

    const mockOverviewData = () => ({
        summary: {
            totalEmployees: 45,
            activeEmployees: 42,
            onLeave: 3,
            newHires: 5,
            resignations: 1,
            avgAttendance: 94.5,
            totalPayroll: 450000,
            pendingLeaves: 8
        },
        monthlyData: [
            { month: 'Jan', employees: 40, payroll: 400000, attendance: 92 },
            { month: 'Feb', employees: 41, payroll: 410000, attendance: 94 },
            { month: 'Mar', employees: 42, payroll: 420000, attendance: 93 },
            { month: 'Apr', employees: 43, payroll: 430000, attendance: 95 },
            { month: 'May', employees: 44, payroll: 440000, attendance: 94 },
            { month: 'Jun', employees: 45, payroll: 450000, attendance: 96 },
        ],
        departmentWise: [
            { name: 'Engineering', employees: 15, percentage: 33 },
            { name: 'Sales', employees: 10, percentage: 22 },
            { name: 'Marketing', employees: 8, percentage: 18 },
            { name: 'HR', employees: 5, percentage: 11 },
            { name: 'Finance', employees: 4, percentage: 9 },
            { name: 'Operations', employees: 3, percentage: 7 },
        ]
    });

    const handleExport = async (format = 'pdf') => {
        try {
            const response = await reportsService.exportReport?.(activeReport, { ...dateRange, format });
            if (response?.data) {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${activeReport}-report.${format}`);
                document.body.appendChild(link);
                link.click();
                link.remove();
            }
        } catch (error) {
            alert('Export feature coming soon');
        }
    };

    const StatCard = ({ icon: Icon, label, value, change, color, prefix = '' }) => (
        <div className={`report-stat-card ${color}`}>
            <div className="stat-icon"><Icon size={24} /></div>
            <div className="stat-info">
                <span className="stat-value">{prefix}{typeof value === 'number' ? value.toLocaleString() : value}</span>
                <span className="stat-label">{label}</span>
                {change !== undefined && (
                    <span className={`stat-change ${change >= 0 ? 'positive' : 'negative'}`}>
                        {change >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                        {Math.abs(change)}%
                    </span>
                )}
            </div>
        </div>
    );

    const renderOverviewReport = () => {
        const data = reportData?.summary || mockOverviewData().summary;
        const monthlyData = reportData?.monthlyData || mockOverviewData().monthlyData;
        const deptData = reportData?.departmentWise || mockOverviewData().departmentWise;

        return (
            <>
                <div className="report-stats-grid">
                    <StatCard icon={Users} label="Total Employees" value={data.totalEmployees} change={12} color="blue" />
                    <StatCard icon={Users} label="Active Employees" value={data.activeEmployees} color="green" />
                    <StatCard icon={Calendar} label="On Leave Today" value={data.onLeave} color="orange" />
                    <StatCard icon={Users} label="New Hires This Month" value={data.newHires} change={25} color="purple" />
                    <StatCard icon={Clock} label="Avg Attendance %" value={data.avgAttendance} change={2.5} color="cyan" />
                    <StatCard icon={DollarSign} label="Monthly Payroll" value={data.totalPayroll} prefix="₹" color="green" />
                </div>

                <div className="report-grid">
                    {/* Employee Trend Chart */}
                    <div className="report-card chart-card">
                        <div className="card-header">
                            <h3 className="card-title">Employee Growth Trend</h3>
                        </div>
                        <div className="card-body">
                            <div className="simple-chart">
                                {monthlyData.map((item, index) => (
                                    <div key={index} className="chart-bar-container">
                                        <div
                                            className="chart-bar blue"
                                            style={{ height: `${(item.employees / 50) * 100}%` }}
                                        >
                                            <span className="bar-value">{item.employees}</span>
                                        </div>
                                        <span className="chart-label">{item.month}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Department Distribution */}
                    <div className="report-card">
                        <div className="card-header">
                            <h3 className="card-title">Department Distribution</h3>
                        </div>
                        <div className="card-body">
                            <div className="department-list">
                                {deptData.map((dept, index) => (
                                    <div key={index} className="dept-row">
                                        <div className="dept-info">
                                            <span className="dept-name">{dept.name}</span>
                                            <span className="dept-count">{dept.employees} employees</span>
                                        </div>
                                        <div className="dept-bar-container">
                                            <div className="dept-bar" style={{ width: `${dept.percentage}%` }}></div>
                                            <span className="dept-percentage">{dept.percentage}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Attendance Chart */}
                    <div className="report-card chart-card">
                        <div className="card-header">
                            <h3 className="card-title">Monthly Attendance Rate</h3>
                        </div>
                        <div className="card-body">
                            <div className="simple-chart">
                                {monthlyData.map((item, index) => (
                                    <div key={index} className="chart-bar-container">
                                        <div
                                            className="chart-bar green"
                                            style={{ height: `${item.attendance}%` }}
                                        >
                                            <span className="bar-value">{item.attendance}%</span>
                                        </div>
                                        <span className="chart-label">{item.month}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Payroll Chart */}
                    <div className="report-card chart-card">
                        <div className="card-header">
                            <h3 className="card-title">Monthly Payroll (₹)</h3>
                        </div>
                        <div className="card-body">
                            <div className="simple-chart">
                                {monthlyData.map((item, index) => (
                                    <div key={index} className="chart-bar-container">
                                        <div
                                            className="chart-bar purple"
                                            style={{ height: `${(item.payroll / 500000) * 100}%` }}
                                        >
                                            <span className="bar-value">{(item.payroll / 1000).toFixed(0)}K</span>
                                        </div>
                                        <span className="chart-label">{item.month}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    const renderAttendanceReport = () => (
        <div className="report-content">
            <div className="report-stats-grid small">
                <StatCard icon={Users} label="Total Days" value={30} color="blue" />
                <StatCard icon={Clock} label="Present Days" value={26} color="green" />
                <StatCard icon={Clock} label="Absent Days" value={2} color="red" />
                <StatCard icon={Clock} label="Late Days" value={2} color="orange" />
            </div>
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Employee</th>
                            <th>Present</th>
                            <th>Absent</th>
                            <th>Late</th>
                            <th>Leave</th>
                            <th>Attendance %</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td><div className="employee-cell"><div className="avatar">JD</div>John Doe</div></td>
                            <td className="text-success">24</td>
                            <td className="text-danger">1</td>
                            <td className="text-warning">2</td>
                            <td>3</td>
                            <td><span className="badge badge-success">92%</span></td>
                        </tr>
                        <tr><td colSpan="7" className="empty-row">Select date range to view detailed report</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderLeaveReport = () => (
        <div className="report-content">
            <div className="report-stats-grid small">
                <StatCard icon={Calendar} label="Total Requests" value={45} color="blue" />
                <StatCard icon={Calendar} label="Approved" value={38} color="green" />
                <StatCard icon={Calendar} label="Pending" value={5} color="orange" />
                <StatCard icon={Calendar} label="Rejected" value={2} color="red" />
            </div>
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Leave Type</th>
                            <th>Total Requests</th>
                            <th>Approved</th>
                            <th>Pending</th>
                            <th>Rejected</th>
                            <th>Days Used</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Casual Leave</td>
                            <td>20</td>
                            <td className="text-success">18</td>
                            <td className="text-warning">1</td>
                            <td className="text-danger">1</td>
                            <td>36</td>
                        </tr>
                        <tr>
                            <td>Sick Leave</td>
                            <td>15</td>
                            <td className="text-success">14</td>
                            <td className="text-warning">1</td>
                            <td className="text-danger">0</td>
                            <td>28</td>
                        </tr>
                        <tr>
                            <td>Annual Leave</td>
                            <td>10</td>
                            <td className="text-success">6</td>
                            <td className="text-warning">3</td>
                            <td className="text-danger">1</td>
                            <td>45</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderPayrollReport = () => (
        <div className="report-content">
            <div className="report-stats-grid small">
                <StatCard icon={DollarSign} label="Total Salary" value={450000} prefix="₹" color="green" />
                <StatCard icon={DollarSign} label="Allowances" value={45000} prefix="₹" color="blue" />
                <StatCard icon={DollarSign} label="Deductions" value={25000} prefix="₹" color="red" />
                <StatCard icon={DollarSign} label="Net Payable" value={470000} prefix="₹" color="purple" />
            </div>
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Department</th>
                            <th>Employees</th>
                            <th>Basic Salary</th>
                            <th>Allowances</th>
                            <th>Deductions</th>
                            <th>Net Salary</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Engineering</td>
                            <td>15</td>
                            <td>₹180,000</td>
                            <td>₹18,000</td>
                            <td>₹10,000</td>
                            <td><strong>₹188,000</strong></td>
                        </tr>
                        <tr>
                            <td>Sales</td>
                            <td>10</td>
                            <td>₹120,000</td>
                            <td>₹15,000</td>
                            <td>₹8,000</td>
                            <td><strong>₹127,000</strong></td>
                        </tr>
                        <tr>
                            <td>Marketing</td>
                            <td>8</td>
                            <td>₹96,000</td>
                            <td>₹8,000</td>
                            <td>₹5,000</td>
                            <td><strong>₹99,000</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderContent = () => {
        if (loading) return <div className="loading">Loading report...</div>;

        switch (activeReport) {
            case 'attendance': return renderAttendanceReport();
            case 'leave': return renderLeaveReport();
            case 'payroll': return renderPayrollReport();
            case 'employee': return renderOverviewReport();
            case 'performance': return renderOverviewReport();
            default: return renderOverviewReport();
        }
    };

    return (
        <div className="reports-page">
            <div className="page-header">
                <div>
                    <h1>Reports</h1>
                    <p className="breadcrumb">Analytics & Reports</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-outline" onClick={() => handleExport('csv')}>
                        <Download size={16} /> Export CSV
                    </button>
                    <button className="btn btn-primary" onClick={() => handleExport('pdf')}>
                        <Download size={16} /> Export PDF
                    </button>
                </div>
            </div>

            {/* Report Type Tabs */}
            <div className="report-tabs">
                {reports.map(report => {
                    const Icon = report.icon;
                    return (
                        <button
                            key={report.key}
                            className={`report-tab ${activeReport === report.key ? 'active' : ''}`}
                            onClick={() => setActiveReport(report.key)}
                        >
                            <Icon size={18} />
                            <span>{report.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Date Range Filter */}
            <div className="report-filters">
                <div className="filter-group">
                    <label>From:</label>
                    <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    />
                </div>
                <div className="filter-group">
                    <label>To:</label>
                    <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    />
                </div>
                <button className="btn btn-secondary" onClick={loadReport}>
                    <Filter size={16} /> Apply Filter
                </button>
            </div>

            {/* Report Content */}
            {renderContent()}
        </div>
    );
}
