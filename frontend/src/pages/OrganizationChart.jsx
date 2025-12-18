import { useState, useEffect } from 'react';
import { Users, Building, ChevronDown, ChevronRight, Grid, List, Download } from 'lucide-react';
import { organizationService } from '../services/organizationService';
import { staffService } from '../services/staffService';
import './OrganizationChart.css';

export default function OrganizationChart() {
    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('chart'); // 'chart' or 'list'
    const [expandedDepts, setExpandedDepts] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [deptRes, empRes] = await Promise.all([
                organizationService.getDepartments(),
                staffService.getStaff({ per_page: 100 })
            ]);

            const depts = deptRes.data.data || deptRes.data || [];
            const emps = empRes.data.data?.data || empRes.data.data || [];

            setDepartments(depts);
            setEmployees(emps);
            setExpandedDepts(depts.map(d => d.id));
        } catch (error) {
            console.error('Error:', error);
            // Mock data
            setDepartments([
                { id: 1, name: 'Executive', head: 'John CEO' },
                { id: 2, name: 'Engineering', head: 'Jane CTO' },
                { id: 3, name: 'Sales', head: 'Mike VP Sales' },
                { id: 4, name: 'Marketing', head: 'Sarah CMO' },
                { id: 5, name: 'HR', head: 'Tom HR Director' },
            ]);
            setEmployees([
                { id: 1, full_name: 'John CEO', department: { id: 1, name: 'Executive' }, designation: { name: 'CEO' }, reports_to: null },
                { id: 2, full_name: 'Jane CTO', department: { id: 2, name: 'Engineering' }, designation: { name: 'CTO' }, reports_to: 1 },
                { id: 3, full_name: 'Mike VP Sales', department: { id: 3, name: 'Sales' }, designation: { name: 'VP Sales' }, reports_to: 1 },
                { id: 4, full_name: 'Dev 1', department: { id: 2, name: 'Engineering' }, designation: { name: 'Developer' }, reports_to: 2 },
                { id: 5, full_name: 'Dev 2', department: { id: 2, name: 'Engineering' }, designation: { name: 'Developer' }, reports_to: 2 },
                { id: 6, full_name: 'Sales Rep 1', department: { id: 3, name: 'Sales' }, designation: { name: 'Sales Rep' }, reports_to: 3 },
            ]);
            setExpandedDepts([1, 2, 3, 4, 5]);
        } finally {
            setLoading(false);
        }
    };

    const toggleDept = (deptId) => {
        setExpandedDepts(prev =>
            prev.includes(deptId) ? prev.filter(id => id !== deptId) : [...prev, deptId]
        );
    };

    const getEmployeesByDepartment = (deptId) => {
        return employees.filter(e => e.department?.id === deptId || e.division?.id === deptId);
    };

    const getLeaders = () => {
        return employees.filter(e => !e.reports_to);
    };

    const getSubordinates = (managerId) => {
        return employees.filter(e => e.reports_to === managerId);
    };

    const renderOrgNode = (employee, level = 0) => {
        const subordinates = getSubordinates(employee.id);

        return (
            <div key={employee.id} className="org-node" style={{ '--level': level }}>
                <div className="node-card">
                    <div className="node-avatar">
                        {employee.avatar ? (
                            <img src={employee.avatar} alt="" />
                        ) : (
                            employee.full_name?.charAt(0) || 'E'
                        )}
                    </div>
                    <div className="node-info">
                        <strong>{employee.full_name}</strong>
                        <span className="designation">{employee.designation?.name || employee.job_title?.title}</span>
                        <span className="department">{employee.department?.name || employee.division?.title}</span>
                    </div>
                </div>
                {subordinates.length > 0 && (
                    <div className="node-children">
                        {subordinates.map(sub => renderOrgNode(sub, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    const renderChart = () => {
        const leaders = getLeaders();

        if (leaders.length === 0) {
            return (
                <div className="empty-state">
                    <Users size={48} />
                    <p>No organizational hierarchy found</p>
                    <span>Make sure employees have "Reports To" field set</span>
                </div>
            );
        }

        return (
            <div className="org-chart">
                {leaders.map(leader => renderOrgNode(leader))}
            </div>
        );
    };

    const renderDepartmentView = () => (
        <div className="department-view">
            {departments.map(dept => {
                const deptEmployees = getEmployeesByDepartment(dept.id);
                const isExpanded = expandedDepts.includes(dept.id);

                return (
                    <div key={dept.id} className="dept-section">
                        <div className="dept-header" onClick={() => toggleDept(dept.id)}>
                            <div className="dept-title">
                                {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                <Building size={20} />
                                <span>{dept.name}</span>
                            </div>
                            <span className="emp-count">{deptEmployees.length} employees</span>
                        </div>

                        {isExpanded && (
                            <div className="dept-employees">
                                {deptEmployees.length === 0 ? (
                                    <p className="no-employees">No employees in this department</p>
                                ) : (
                                    <div className="employee-cards">
                                        {deptEmployees.map(emp => (
                                            <div key={emp.id} className="emp-card">
                                                <div className="emp-avatar">
                                                    {emp.full_name?.charAt(0) || 'E'}
                                                </div>
                                                <div className="emp-details">
                                                    <strong>{emp.full_name}</strong>
                                                    <span>{emp.designation?.name || emp.job_title?.title || 'Employee'}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="org-chart-page">
            <div className="page-header">
                <div>
                    <h1>Organization Chart</h1>
                    <p className="breadcrumb">HR Management &gt; Organization Chart</p>
                </div>
                <div className="header-actions">
                    <div className="view-toggle">
                        <button
                            className={`btn btn-ghost ${viewMode === 'chart' ? 'active' : ''}`}
                            onClick={() => setViewMode('chart')}
                        >
                            <Grid size={16} /> Hierarchy
                        </button>
                        <button
                            className={`btn btn-ghost ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            <List size={16} /> By Department
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid mini">
                <div className="stat-card blue">
                    <div className="stat-icon"><Building size={20} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{departments.length}</span>
                        <span className="stat-label">Departments</span>
                    </div>
                </div>
                <div className="stat-card green">
                    <div className="stat-icon"><Users size={20} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{employees.length}</span>
                        <span className="stat-label">Total Employees</span>
                    </div>
                </div>
                <div className="stat-card purple">
                    <div className="stat-icon"><Users size={20} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{getLeaders().length}</span>
                        <span className="stat-label">Leadership</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="org-content">
                {viewMode === 'chart' ? renderChart() : renderDepartmentView()}
            </div>
        </div>
    );
}
