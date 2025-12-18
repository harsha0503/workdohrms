import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Briefcase, Users, Calendar, Eye, Edit, Trash2, ChevronRight } from 'lucide-react';
import recruitmentService from '../services/recruitmentService';
import Modal from '../components/Modal';
import './Recruitment.css';

export default function Recruitment() {
    const [activeTab, setActiveTab] = useState('jobs');
    const [jobs, setJobs] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [formData, setFormData] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'jobs') {
                const res = await recruitmentService.getJobs();
                setJobs(res.data.data?.data || res.data.data || []);
            } else if (activeTab === 'candidates') {
                const res = await recruitmentService.getCandidates();
                setCandidates(res.data.data?.data || res.data.data || []);
            } else if (activeTab === 'interviews') {
                const res = await recruitmentService.getInterviews();
                setInterviews(res.data.data?.data || res.data.data || []);
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
        setLoading(false);
    };

    const openModal = (type, data = {}) => {
        setModalType(type);
        setFormData(data);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalType === 'job') {
                if (formData.id) {
                    await recruitmentService.updateJob(formData.id, formData);
                } else {
                    await recruitmentService.createJob(formData);
                }
            } else if (modalType === 'candidate') {
                if (formData.id) {
                    await recruitmentService.updateCandidate(formData.id, formData);
                } else {
                    await recruitmentService.createCandidate(formData);
                }
            }
            setShowModal(false);
            loadData();
        } catch (error) {
            console.error('Error saving:', error);
        }
    };

    const handleDelete = async (type, id) => {
        if (!confirm('Are you sure you want to delete this?')) return;
        try {
            if (type === 'job') await recruitmentService.deleteJob(id);
            else if (type === 'candidate') await recruitmentService.deleteCandidate(id);
            loadData();
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    const getStatusBadge = (status) => {
        const colors = {
            draft: 'badge-secondary',
            published: 'badge-success',
            closed: 'badge-danger',
            new: 'badge-info',
            screening: 'badge-warning',
            interviewing: 'badge-primary',
            hired: 'badge-success',
            rejected: 'badge-danger',
            scheduled: 'badge-info',
            completed: 'badge-success',
        };
        return colors[status] || 'badge-secondary';
    };

    return (
        <div className="recruitment-page">
            <div className="page-header">
                <div>
                    <h1>Recruitment</h1>
                    <p>Manage job postings, candidates, and interviews</p>
                </div>
                <button className="btn btn-primary" onClick={() => openModal(activeTab === 'jobs' ? 'job' : 'candidate')}>
                    <Plus size={18} />
                    Add {activeTab === 'jobs' ? 'Job' : activeTab === 'candidates' ? 'Candidate' : 'Interview'}
                </button>
            </div>

            {/* Tabs */}
            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'jobs' ? 'active' : ''}`}
                    onClick={() => setActiveTab('jobs')}
                >
                    <Briefcase size={18} />
                    Jobs
                </button>
                <button
                    className={`tab ${activeTab === 'candidates' ? 'active' : ''}`}
                    onClick={() => setActiveTab('candidates')}
                >
                    <Users size={18} />
                    Candidates
                </button>
                <button
                    className={`tab ${activeTab === 'interviews' ? 'active' : ''}`}
                    onClick={() => setActiveTab('interviews')}
                >
                    <Calendar size={18} />
                    Interviews
                </button>
            </div>

            {/* Search Bar */}
            <div className="search-bar">
                <Search size={18} />
                <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-secondary">
                    <Filter size={18} />
                    Filters
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <div className="content-area">
                    {activeTab === 'jobs' && (
                        <div className="jobs-grid">
                            {jobs.length === 0 ? (
                                <div className="empty-state">
                                    <Briefcase size={48} />
                                    <h3>No Job Postings</h3>
                                    <p>Create your first job posting to start recruiting.</p>
                                    <button className="btn btn-primary" onClick={() => openModal('job')}>
                                        <Plus size={18} /> Create Job
                                    </button>
                                </div>
                            ) : (
                                jobs.filter(j => j.title?.toLowerCase().includes(searchTerm.toLowerCase())).map(job => (
                                    <div key={job.id} className="job-card">
                                        <div className="job-header">
                                            <h3>{job.title}</h3>
                                            <span className={`badge ${getStatusBadge(job.status)}`}>{job.status}</span>
                                        </div>
                                        <div className="job-meta">
                                            <span>{job.employment_type || 'Full-time'}</span>
                                            <span>{job.location || 'Remote'}</span>
                                        </div>
                                        <p className="job-description">{job.description?.substring(0, 100)}...</p>
                                        <div className="job-stats">
                                            <span><Users size={14} /> {job.applications_count || 0} applicants</span>
                                            <span><Calendar size={14} /> {new Date(job.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="job-actions">
                                            <button className="btn btn-sm" onClick={() => openModal('job', job)}><Edit size={14} /></button>
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete('job', job.id)}><Trash2 size={14} /></button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'candidates' && (
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Source</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {candidates.length === 0 ? (
                                        <tr><td colSpan={6} className="empty-row">No candidates found</td></tr>
                                    ) : (
                                        candidates.filter(c => c.name?.toLowerCase().includes(searchTerm.toLowerCase())).map(candidate => (
                                            <tr key={candidate.id}>
                                                <td className="name-cell">
                                                    <div className="avatar">{candidate.name?.charAt(0)}</div>
                                                    {candidate.name}
                                                </td>
                                                <td>{candidate.email}</td>
                                                <td>{candidate.phone}</td>
                                                <td>{candidate.source || 'Direct'}</td>
                                                <td><span className={`badge ${getStatusBadge(candidate.status)}`}>{candidate.status}</span></td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button className="btn btn-sm" onClick={() => openModal('candidate', candidate)}><Edit size={14} /></button>
                                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete('candidate', candidate.id)}><Trash2 size={14} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'interviews' && (
                        <div className="interviews-list">
                            {interviews.length === 0 ? (
                                <div className="empty-state">
                                    <Calendar size={48} />
                                    <h3>No Scheduled Interviews</h3>
                                    <p>Interviews will appear here once scheduled.</p>
                                </div>
                            ) : (
                                interviews.map(interview => (
                                    <div key={interview.id} className="interview-card">
                                        <div className="interview-time">
                                            <span className="date">{new Date(interview.scheduled_at).toLocaleDateString()}</span>
                                            <span className="time">{new Date(interview.scheduled_at).toLocaleTimeString()}</span>
                                        </div>
                                        <div className="interview-details">
                                            <h4>{interview.candidate?.name || 'Candidate'}</h4>
                                            <p>{interview.job?.title || 'Position'}</p>
                                            <span className={`badge ${getStatusBadge(interview.status)}`}>{interview.status}</span>
                                        </div>
                                        <div className="interview-actions">
                                            <button className="btn btn-sm"><Eye size={14} /> View</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={`${formData.id ? 'Edit' : 'Add'} ${modalType}`}>
                <form onSubmit={handleSubmit}>
                    {modalType === 'job' && (
                        <>
                            <div className="form-group">
                                <label>Job Title</label>
                                <input type="text" value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Employment Type</label>
                                <select value={formData.employment_type || 'full_time'} onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}>
                                    <option value="full_time">Full-time</option>
                                    <option value="part_time">Part-time</option>
                                    <option value="contract">Contract</option>
                                    <option value="internship">Internship</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Location</label>
                                <input type="text" value={formData.location || ''} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4}></textarea>
                            </div>
                        </>
                    )}
                    {modalType === 'candidate' && (
                        <>
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input type="tel" value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Source</label>
                                <select value={formData.source || 'direct'} onChange={(e) => setFormData({ ...formData, source: e.target.value })}>
                                    <option value="direct">Direct</option>
                                    <option value="linkedin">LinkedIn</option>
                                    <option value="referral">Referral</option>
                                    <option value="job_board">Job Board</option>
                                    <option value="agency">Agency</option>
                                </select>
                            </div>
                        </>
                    )}
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
