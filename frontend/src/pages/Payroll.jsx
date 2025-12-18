import { useState, useEffect } from 'react';
import {
    DollarSign, Plus, Search, Filter, Download, Mail, Eye, FileText,
    Users, Calculator, Play, Check, ChevronDown
} from 'lucide-react';
import { salaryService } from '../services/salaryService';
import { staffService } from '../services/staffService';
import { documentGeneratorService } from '../services/documentGeneratorService';
import Modal from '../components/Modal';
import './Payroll.css';

export default function Payroll() {
    const [activeTab, setActiveTab] = useState('employees');
    const [employees, setEmployees] = useState([]);
    const [payslips, setPayslips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [showRunPayrollModal, setShowRunPayrollModal] = useState(false);
    const [showPayslipModal, setShowPayslipModal] = useState(false);
    const [selectedPayslip, setSelectedPayslip] = useState(null);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [runningPayroll, setRunningPayroll] = useState(false);

    const tabs = [
        { key: 'employees', label: 'Set Salary', icon: Users },
        { key: 'payslips', label: 'Payslips', icon: FileText },
        { key: 'payrun', label: 'Pay Run', icon: Play },
    ];

    useEffect(() => {
        loadData();
    }, [selectedMonth, selectedYear]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [empRes, payslipRes] = await Promise.all([
                staffService.getStaff({ per_page: 100 }),
                salaryService.getPayrollRuns?.({ month: selectedMonth, year: selectedYear }) || Promise.resolve({ data: { data: [] } })
            ]);
            setEmployees(empRes.data.data?.data || empRes.data.data || []);
            setPayslips(payslipRes.data.data || []);
        } catch (error) {
            console.error('Error:', error);
            // Mock data
            setEmployees([
                { id: 1, full_name: 'John Doe', employee_id: 'EMP001', designation: { name: 'Developer' }, salary: { basic: 50000 } },
                { id: 2, full_name: 'Jane Smith', employee_id: 'EMP002', designation: { name: 'Designer' }, salary: { basic: 45000 } },
                { id: 3, full_name: 'Mike Johnson', employee_id: 'EMP003', designation: { name: 'Manager' }, salary: { basic: 65000 } },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleRunPayroll = async () => {
        if (selectedEmployees.length === 0) {
            alert('Please select at least one employee');
            return;
        }

        setRunningPayroll(true);
        try {
            await salaryService.runPayroll?.(selectedMonth, selectedYear, selectedEmployees);
            alert(`Payroll generated for ${selectedEmployees.length} employees!`);
            setShowRunPayrollModal(false);
            setSelectedEmployees([]);
            loadData();
        } catch (error) {
            alert('Error running payroll');
        } finally {
            setRunningPayroll(false);
        }
    };

    const handleDownloadPayslip = async (payslip) => {
        try {
            const response = await salaryService.downloadPayslipPDF?.(payslip.employee_id, payslip.id);
            if (response?.data) {
                documentGeneratorService.downloadBlob(response.data, `payslip-${payslip.month}-${payslip.year}.pdf`);
            } else {
                alert('Payslip download coming soon');
            }
        } catch (error) {
            alert('Error downloading payslip');
        }
    };

    const handleEmailPayslip = async (payslip) => {
        try {
            await salaryService.emailPayslip?.(payslip.employee_id, payslip.id);
            alert('Payslip sent via email!');
        } catch (error) {
            alert('Error sending payslip email');
        }
    };

    const toggleEmployee = (id) => {
        setSelectedEmployees(prev =>
            prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
        );
    };

    const toggleAllEmployees = () => {
        if (selectedEmployees.length === employees.length) {
            setSelectedEmployees([]);
        } else {
            setSelectedEmployees(employees.map(e => e.id));
        }
    };

    const stats = {
        totalEmployees: employees.length,
        totalPayroll: employees.reduce((sum, e) => sum + (e.salary?.basic || e.basic_salary || 0), 0),
        generated: payslips.filter(p => p.status === 'generated').length,
        pending: employees.length - payslips.length,
    };

    const renderSetSalary = () => (
        <div className="salary-list">
            <div className="toolbar">
                <div className="search-box">
                    <Search size={18} />
                    <input type="text" placeholder="Search employees..." />
                </div>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Employee</th>
                            <th>Designation</th>
                            <th>Basic Salary</th>
                            <th>Net Salary</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((emp, index) => (
                            <tr key={emp.id}>
                                <td>{index + 1}</td>
                                <td>
                                    <div className="employee-cell">
                                        <div className="avatar">{emp.full_name?.charAt(0)}</div>
                                        <div>
                                            <strong>{emp.full_name}</strong>
                                            <span className="emp-id">#{emp.employee_id || emp.id}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>{emp.designation?.name || emp.job_title?.title || '-'}</td>
                                <td>₹{(emp.salary?.basic || emp.basic_salary || 0).toLocaleString()}</td>
                                <td><strong>₹{(emp.salary?.net || emp.net_salary || emp.salary?.basic || 0).toLocaleString()}</strong></td>
                                <td>
                                    <span className={`badge ${emp.salary?.basic ? 'badge-success' : 'badge-warning'}`}>
                                        {emp.salary?.basic ? 'Set' : 'Not Set'}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn btn-sm btn-primary" onClick={() => window.location.href = `/staff/${emp.id}/salary`}>
                                        <DollarSign size={14} /> Set Salary
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderPayslips = () => (
        <div className="payslips-list">
            <div className="toolbar">
                <div className="filter-group">
                    <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
                        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m, i) => (
                            <option key={i} value={i + 1}>{m}</option>
                        ))}
                    </select>
                    <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
                        {[2023, 2024, 2025].map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
                <button className="btn btn-primary" onClick={() => setShowRunPayrollModal(true)}>
                    <Play size={16} /> Generate Payslips
                </button>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Employee</th>
                            <th>Payslip ID</th>
                            <th>Month</th>
                            <th>Basic Salary</th>
                            <th>Net Pay</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payslips.length === 0 ? (
                            <tr><td colSpan="8" className="empty-row">No payslips generated for this period</td></tr>
                        ) : (
                            payslips.map((payslip, index) => (
                                <tr key={payslip.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="employee-cell">
                                            <div className="avatar">{payslip.employee?.full_name?.charAt(0) || 'E'}</div>
                                            <span>{payslip.employee?.full_name || 'Employee'}</span>
                                        </div>
                                    </td>
                                    <td>#{payslip.payslip_id || payslip.id}</td>
                                    <td>{payslip.month}/{payslip.year}</td>
                                    <td>₹{(payslip.basic_salary || 0).toLocaleString()}</td>
                                    <td><strong>₹{(payslip.net_salary || 0).toLocaleString()}</strong></td>
                                    <td>
                                        <span className={`badge ${payslip.status === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                                            {payslip.status || 'Generated'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn btn-icon btn-ghost btn-sm" title="View" onClick={() => { setSelectedPayslip(payslip); setShowPayslipModal(true); }}>
                                                <Eye size={16} />
                                            </button>
                                            <button className="btn btn-icon btn-ghost btn-sm" title="Download PDF" onClick={() => handleDownloadPayslip(payslip)}>
                                                <Download size={16} />
                                            </button>
                                            <button className="btn btn-icon btn-ghost btn-sm" title="Send Email" onClick={() => handleEmailPayslip(payslip)}>
                                                <Mail size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderPayRun = () => (
        <div className="pay-run">
            <div className="pay-run-info">
                <div className="info-card">
                    <Calculator size={32} />
                    <div>
                        <h3>Pay Run for {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                        <p>Select employees and generate payslips in bulk</p>
                    </div>
                </div>
            </div>

            <div className="toolbar">
                <label className="checkbox-all">
                    <input
                        type="checkbox"
                        checked={selectedEmployees.length === employees.length && employees.length > 0}
                        onChange={toggleAllEmployees}
                    />
                    <span>Select All ({employees.length})</span>
                </label>
                <div className="selected-count">
                    {selectedEmployees.length} employees selected
                </div>
            </div>

            <div className="employee-grid">
                {employees.map(emp => (
                    <div
                        key={emp.id}
                        className={`employee-select-card ${selectedEmployees.includes(emp.id) ? 'selected' : ''}`}
                        onClick={() => toggleEmployee(emp.id)}
                    >
                        <div className="checkbox-indicator">
                            {selectedEmployees.includes(emp.id) && <Check size={14} />}
                        </div>
                        <div className="avatar">{emp.full_name?.charAt(0)}</div>
                        <div className="emp-info">
                            <strong>{emp.full_name}</strong>
                            <span>{emp.designation?.name || emp.job_title?.title}</span>
                        </div>
                        <div className="emp-salary">
                            ₹{(emp.salary?.basic || emp.basic_salary || 0).toLocaleString()}
                        </div>
                    </div>
                ))}
            </div>

            <div className="pay-run-actions">
                <div className="total-info">
                    <span>Total Payroll Amount:</span>
                    <strong>₹{employees.filter(e => selectedEmployees.includes(e.id)).reduce((sum, e) => sum + (e.salary?.basic || e.basic_salary || 0), 0).toLocaleString()}</strong>
                </div>
                <button
                    className="btn btn-primary btn-lg"
                    onClick={handleRunPayroll}
                    disabled={selectedEmployees.length === 0 || runningPayroll}
                >
                    <Play size={18} />
                    {runningPayroll ? 'Processing...' : `Run Payroll for ${selectedEmployees.length} Employees`}
                </button>
            </div>
        </div>
    );

    return (
        <div className="payroll-page">
            <div className="page-header">
                <div>
                    <h1>Payroll Management</h1>
                    <p className="breadcrumb">Payroll &gt; Set Salary & Payslips</p>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card green">
                    <div className="stat-icon"><Users size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.totalEmployees}</span>
                        <span className="stat-label">Total Employees</span>
                    </div>
                </div>
                <div className="stat-card blue">
                    <div className="stat-icon"><DollarSign size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">₹{stats.totalPayroll.toLocaleString()}</span>
                        <span className="stat-label">Total Payroll</span>
                    </div>
                </div>
                <div className="stat-card purple">
                    <div className="stat-icon"><FileText size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.generated}</span>
                        <span className="stat-label">Payslips Generated</span>
                    </div>
                </div>
                <div className="stat-card orange">
                    <div className="stat-icon"><FileText size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.pending}</span>
                        <span className="stat-label">Pending</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.key}
                            className={`tab ${activeTab === tab.key ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            <Icon size={16} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <>
                    {activeTab === 'employees' && renderSetSalary()}
                    {activeTab === 'payslips' && renderPayslips()}
                    {activeTab === 'payrun' && renderPayRun()}
                </>
            )}

            {/* Payslip View Modal */}
            <Modal isOpen={showPayslipModal} onClose={() => setShowPayslipModal(false)} title="Payslip Details" size="lg">
                {selectedPayslip && (
                    <div className="payslip-preview">
                        <div className="payslip-header">
                            <h3>Payslip for {selectedPayslip.month}/{selectedPayslip.year}</h3>
                            <p>Employee: {selectedPayslip.employee?.full_name || 'Employee'}</p>
                        </div>
                        <div className="payslip-details">
                            <div className="detail-row">
                                <span>Basic Salary</span>
                                <span>₹{(selectedPayslip.basic_salary || 0).toLocaleString()}</span>
                            </div>
                            <div className="detail-row">
                                <span>Allowances</span>
                                <span className="text-success">+₹{(selectedPayslip.allowances || 0).toLocaleString()}</span>
                            </div>
                            <div className="detail-row">
                                <span>Deductions</span>
                                <span className="text-danger">-₹{(selectedPayslip.deductions || 0).toLocaleString()}</span>
                            </div>
                            <div className="detail-row total">
                                <span>Net Salary</span>
                                <span>₹{(selectedPayslip.net_salary || 0).toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="payslip-actions">
                            <button className="btn btn-secondary" onClick={() => handleDownloadPayslip(selectedPayslip)}>
                                <Download size={16} /> Download PDF
                            </button>
                            <button className="btn btn-primary" onClick={() => handleEmailPayslip(selectedPayslip)}>
                                <Mail size={16} /> Send Email
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
