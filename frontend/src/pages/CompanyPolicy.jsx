import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FileText, Download, Eye } from 'lucide-react';
import hrAdminService from '../services/hrAdminService';
import Modal from '../components/Modal';
import './CompanyPolicy.css';

export default function CompanyPolicy() {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await hrAdminService.getPolicies();
            setPolicies(res.data.data?.data || res.data.data || []);
        } catch (error) {
            console.error('Error loading policies:', error);
        }
        setLoading(false);
    };

    const openModal = (policy = {}) => {
        setFormData(policy);
        setSelectedFile(null);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const fd = new FormData();
            fd.append('title', formData.title);
            fd.append('description', formData.description || '');
            if (selectedFile) fd.append('attachment', selectedFile);

            if (formData.id) {
                await hrAdminService.updatePolicy(formData.id, fd);
            } else {
                await hrAdminService.createPolicy(fd);
            }
            setShowModal(false);
            loadData();
        } catch (error) {
            console.error('Error saving:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            await hrAdminService.deletePolicy(id);
            loadData();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="policy-page">
            <div className="page-header">
                <div>
                    <h1>Company Policy</h1>
                    <p className="breadcrumb">HR Management &gt; Company Policy</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-primary" onClick={() => openModal()}>
                        <Plus size={18} /> Add Policy
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card blue">
                    <div className="stat-icon"><FileText size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{policies.length}</span>
                        <span className="stat-label">Total Policies</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <div className="policies-grid">
                    {policies.length === 0 ? (
                        <div className="empty-state">
                            <FileText size={48} />
                            <h3>No Policies</h3>
                            <p>Create your first company policy document.</p>
                        </div>
                    ) : (
                        policies.map(policy => (
                            <div key={policy.id} className="policy-card">
                                <div className="policy-icon"><FileText size={32} /></div>
                                <h3>{policy.title}</h3>
                                <p>{policy.description || 'No description'}</p>
                                <div className="policy-meta">
                                    <span>Created: {new Date(policy.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="card-actions">
                                    {policy.attachment && (
                                        <button className="btn btn-sm btn-info" title="Download">
                                            <Download size={14} />
                                        </button>
                                    )}
                                    <button className="btn btn-sm" onClick={() => openModal(policy)}><Edit size={14} /></button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(policy.id)}><Trash2 size={14} /></button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={`${formData.id ? 'Edit' : 'Add'} Policy`}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Policy Title *</label>
                        <input type="text" value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4}></textarea>
                    </div>
                    <div className="form-group">
                        <label>Attachment (PDF)</label>
                        <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setSelectedFile(e.target.files[0])} />
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
