import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, Briefcase, Building,
    User, FileText, DollarSign, Clock, Award, Shield, Download, Upload
} from 'lucide-react';
import api from '../services/api';
import Modal from '../components/Modal';
import './EmployeeProfile.css';

export default function EmployeeProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [documents, setDocuments] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [awards, setAwards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDocModal, setShowDocModal] = useState(false);
    const [docForm, setDocForm] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [empRes, docsRes, attRes, leaveRes, awardsRes] = await Promise.all([
                api.get(`/staff-members/${id}`),
                api.get(`/staff-members/${id}/documents`),
                api.get(`/attendance?staff_member_id=${id}&per_page=10`),
                api.get(`/leave-applications?staff_member_id=${id}&per_page=10`),
                api.get(`/awards?staff_member_id=${id}`)
            ]);
            setEmployee(empRes.data.data);
            setDocuments(docsRes.data.data || []);
            setAttendance(attRes.data.data?.data || []);
            setLeaves(leaveRes.data.data?.data || []);
            setAwards(awardsRes.data.data?.data || awardsRes.data.data || []);
        } catch (error) {
            console.error('Error loading data:', error);
        }
        setLoading(false);
    };

    const handleUploadDocument = async (e) => {
        e.preventDefault();
        if (!selectedFile) return;
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('name', docForm.name || selectedFile.name);
            formData.append('document_type_id', docForm.document_type_id || '');
            await api.post(`/staff-members/${id}/documents`, formData);
            setShowDocModal(false);
            setSelectedFile(null);
            setDocForm({});
            loadData();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const generateLetter = async (type) => {
        try {
            const res = await api.get(`/staff-members/${id}/${type}/pdf`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.download = `${type}_${employee?.full_name}.pdf`;
            link.click();
        } catch (error) {
            console.error('Error:', error);
            alert('Feature not available');
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!employee) {
        return <div className="error">Employee not found</div>;
    }

    const tabs = [
        { key: 'overview', label: 'Overview', icon: User },
        { key: 'documents', label: 'Documents', icon: FileText },
        { key: 'attendance', label: 'Attendance', icon: Clock },
        { key: 'leaves', label: 'Leaves', icon: Calendar },
        { key: 'awards', label: 'Awards', icon: Award },
        { key: 'salary', label: 'Salary', icon: DollarSign },
    ];

    return (
        <div className="employee-profile-page">
            <div className="page-header">
                <div>
                    <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>
                        <ArrowLeft size={16} /> Back
                    </button>
                </div>
                <div className="header-actions">
                    <Link to={`/staff/${id}/edit`} className="btn btn-primary">
                        <Edit size={18} /> Edit Employee
                    </Link>
                </div>
            </div>

            {/* Profile Header */}
            <div className="profile-header">
                <div className="profile-avatar">
                    {employee.avatar ? (
                        <img src={employee.avatar} alt={employee.full_name} />
                    ) : (
                        <span>{employee.full_name?.charAt(0)}</span>
                    )}
                </div>
                <div className="profile-info">
                    <h1>{employee.full_name}</h1>
                    <p className="designation">{employee.designation?.name || 'N/A'}</p>
                    <div className="profile-meta">
                        <span><Mail size={14} /> {employee.email}</span>
                        <span><Phone size={14} /> {employee.phone || 'N/A'}</span>
                        <span><Building size={14} /> {employee.department?.name || 'N/A'}</span>
                        <span><Briefcase size={14} /> {employee.branch?.name || 'N/A'}</span>
                    </div>
                </div>
                <div className="profile-actions">
                    <button className="btn btn-secondary" onClick={() => generateLetter('joining-letter')}>
                        <Download size={16} /> Joining Letter
                    </button>
                    <button className="btn btn-secondary" onClick={() => generateLetter('experience-certificate')}>
                        <Download size={16} /> Experience Certificate
                    </button>
                    <button className="btn btn-secondary" onClick={() => generateLetter('noc')}>
                        <Download size={16} /> NOC
                    </button>
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
                            <Icon size={16} /> {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {activeTab === 'overview' && (
                    <div className="overview-grid">
                        <div className="info-card">
                            <h3>Personal Information</h3>
                            <div className="info-list">
                                <div className="info-item"><label>Full Name</label><span>{employee.full_name}</span></div>
                                <div className="info-item"><label>Email</label><span>{employee.email}</span></div>
                                <div className="info-item"><label>Phone</label><span>{employee.phone || 'N/A'}</span></div>
                                <div className="info-item"><label>Date of Birth</label><span>{employee.dob || 'N/A'}</span></div>
                                <div className="info-item"><label>Gender</label><span>{employee.gender || 'N/A'}</span></div>
                                <div className="info-item"><label>Address</label><span>{employee.address || 'N/A'}</span></div>
                            </div>
                        </div>
                        <div className="info-card">
                            <h3>Employment Information</h3>
                            <div className="info-list">
                                <div className="info-item"><label>Employee ID</label><span>{employee.employee_id || `EMP-${employee.id}`}</span></div>
                                <div className="info-item"><label>Department</label><span>{employee.department?.name || 'N/A'}</span></div>
                                <div className="info-item"><label>Designation</label><span>{employee.designation?.name || 'N/A'}</span></div>
                                <div className="info-item"><label>Branch</label><span>{employee.branch?.name || 'N/A'}</span></div>
                                <div className="info-item"><label>Joining Date</label><span>{employee.joining_date || 'N/A'}</span></div>
                                <div className="info-item"><label>Employment Type</label><span>{employee.employment_type || 'Full-time'}</span></div>
                            </div>
                        </div>
                        <div className="info-card">
                            <h3>Bank Details</h3>
                            <div className="info-list">
                                <div className="info-item"><label>Account Holder</label><span>{employee.account_holder_name || employee.full_name}</span></div>
                                <div className="info-item"><label>Account Number</label><span>{employee.account_number || 'N/A'}</span></div>
                                <div className="info-item"><label>Bank Name</label><span>{employee.bank_name || 'N/A'}</span></div>
                                <div className="info-item"><label>IFSC Code</label><span>{employee.ifsc_code || employee.bank_identifier || 'N/A'}</span></div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'documents' && (
                    <div>
                        <div className="section-actions">
                            <button className="btn btn-primary" onClick={() => setShowDocModal(true)}>
                                <Upload size={16} /> Upload Document
                            </button>
                        </div>
                        <div className="documents-grid">
                            {documents.length === 0 ? (
                                <p className="empty-text">No documents uploaded</p>
                            ) : (
                                documents.map(doc => (
                                    <div key={doc.id} className="document-card">
                                        <FileText size={32} />
                                        <h4>{doc.name || doc.title}</h4>
                                        <p>{doc.document_type?.name || 'Document'}</p>
                                        <a href={doc.file_url || doc.url} target="_blank" rel="noopener" className="btn btn-sm">
                                            <Download size={14} /> Download
                                        </a>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'attendance' && (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr><th>Date</th><th>Clock In</th><th>Clock Out</th><th>Hours</th><th>Status</th></tr>
                            </thead>
                            <tbody>
                                {attendance.length === 0 ? (
                                    <tr><td colSpan={5} className="empty-row">No attendance records</td></tr>
                                ) : (
                                    attendance.map(att => (
                                        <tr key={att.id}>
                                            <td>{att.date}</td>
                                            <td>{att.clock_in || 'N/A'}</td>
                                            <td>{att.clock_out || 'N/A'}</td>
                                            <td>{att.hours || '-'}</td>
                                            <td><span className={`badge ${att.status === 'present' ? 'badge-success' : 'badge-danger'}`}>{att.status}</span></td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        <Link to="/attendance" className="btn btn-secondary btn-sm">View All Attendance</Link>
                    </div>
                )}

                {activeTab === 'leaves' && (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Status</th></tr>
                            </thead>
                            <tbody>
                                {leaves.length === 0 ? (
                                    <tr><td colSpan={5} className="empty-row">No leave records</td></tr>
                                ) : (
                                    leaves.map(leave => (
                                        <tr key={leave.id}>
                                            <td>{leave.leave_type?.name || 'Leave'}</td>
                                            <td>{leave.start_date}</td>
                                            <td>{leave.end_date}</td>
                                            <td>{leave.days || 1}</td>
                                            <td><span className={`badge badge-${leave.status === 'approved' ? 'success' : leave.status === 'rejected' ? 'danger' : 'warning'}`}>{leave.status}</span></td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'awards' && (
                    <div className="awards-grid">
                        {awards.length === 0 ? (
                            <p className="empty-text">No awards received</p>
                        ) : (
                            awards.map(award => (
                                <div key={award.id} className="award-card">
                                    <Award size={32} className="award-icon" />
                                    <h4>{award.award_type?.name || 'Award'}</h4>
                                    <p>{award.date}</p>
                                    <p className="award-desc">{award.description || 'Congratulations!'}</p>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'salary' && (
                    <div className="salary-section">
                        <div className="salary-overview">
                            <div className="salary-card">
                                <h3>Basic Salary</h3>
                                <span className="amount">₹{parseFloat(employee.salary || 0).toLocaleString()}</span>
                            </div>
                        </div>
                        <Link to={`/staff/${id}/salary`} className="btn btn-primary">
                            <DollarSign size={16} /> Manage Salary Components
                        </Link>
                    </div>
                )}
            </div>

            {/* Upload Document Modal */}
            <Modal isOpen={showDocModal} onClose={() => setShowDocModal(false)} title="Upload Document">
                <form onSubmit={handleUploadDocument}>
                    <div className="form-group">
                        <label>Document Name</label>
                        <input type="text" value={docForm.name || ''} onChange={(e) => setDocForm({ ...docForm, name: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>File *</label>
                        <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} required />
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowDocModal(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Upload</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
