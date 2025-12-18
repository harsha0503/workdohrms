import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FileText, Folder, Download, CheckCircle, Clock, Upload, Eye } from 'lucide-react';
import documentService from '../services/documentService';
import Modal from '../components/Modal';
import './Documents.css';

export default function Documents() {
    const [activeTab, setActiveTab] = useState('documents');
    const [documents, setDocuments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pendingAcks, setPendingAcks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [formData, setFormData] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [categoriesRes, documentsRes, pendingRes] = await Promise.all([
                documentService.getCategories(),
                documentService.getDocuments(),
                documentService.getPendingAcknowledgments()
            ]);
            setCategories(categoriesRes.data.data || []);
            setDocuments(documentsRes.data.data?.data || documentsRes.data.data || []);
            setPendingAcks(pendingRes.data.data || []);
        } catch (error) {
            console.error('Error loading data:', error);
        }
        setLoading(false);
    };

    const openModal = (type, data = {}) => {
        setModalType(type);
        setFormData(data);
        setSelectedFile(null);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalType === 'category') {
                if (formData.id) {
                    await documentService.updateCategory(formData.id, formData);
                } else {
                    await documentService.createCategory(formData);
                }
            } else if (modalType === 'document') {
                const fd = new FormData();
                fd.append('name', formData.name);
                fd.append('category_id', formData.category_id || '');
                fd.append('description', formData.description || '');
                fd.append('requires_acknowledgment', formData.requires_acknowledgment ? '1' : '0');
                if (selectedFile) fd.append('file', selectedFile);
                await documentService.uploadDocument(fd);
            }
            setShowModal(false);
            loadData();
        } catch (error) {
            console.error('Error saving:', error);
        }
    };

    const handleDelete = async (type, id) => {
        if (!confirm('Are you sure?')) return;
        try {
            if (type === 'document') await documentService.deleteDocument(id);
            else if (type === 'category') await documentService.deleteCategory(id);
            loadData();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDownload = async (doc) => {
        try {
            const response = await documentService.downloadDocument(doc.id);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${doc.name}.${doc.file_type}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading:', error);
        }
    };

    const handleAcknowledge = async (docId) => {
        try {
            await documentService.acknowledgeDocument(docId);
            loadData();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const getFileIcon = (fileType) => {
        const icons = {
            pdf: '📄',
            doc: '📝',
            docx: '📝',
            xls: '📊',
            xlsx: '📊',
            ppt: '📊',
            pptx: '📊',
            jpg: '🖼️',
            jpeg: '🖼️',
            png: '🖼️',
        };
        return icons[fileType?.toLowerCase()] || '📁';
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '-';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className="documents-page">
            <div className="page-header">
                <div>
                    <h1>HR Documents</h1>
                    <p className="breadcrumb">Documents &gt; HR Documents</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-secondary" onClick={() => openModal('category')}>
                        <Folder size={18} /> Add Category
                    </button>
                    <button className="btn btn-primary" onClick={() => openModal('document')}>
                        <Upload size={18} /> Upload Document
                    </button>
                </div>
            </div>

            {/* Pending Acknowledgments Alert */}
            {pendingAcks.length > 0 && (
                <div className="alert alert-info">
                    <Clock size={18} />
                    <span>You have <strong>{pendingAcks.length} documents</strong> pending acknowledgment</span>
                </div>
            )}

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card blue">
                    <div className="stat-icon"><FileText size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{documents.length}</span>
                        <span className="stat-label">Total Documents</span>
                    </div>
                </div>
                <div className="stat-card green">
                    <div className="stat-icon"><Folder size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{categories.length}</span>
                        <span className="stat-label">Categories</span>
                    </div>
                </div>
                <div className="stat-card orange">
                    <div className="stat-icon"><Clock size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{pendingAcks.length}</span>
                        <span className="stat-label">Pending Acks</span>
                    </div>
                </div>
                <div className="stat-card purple">
                    <div className="stat-icon"><CheckCircle size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{documents.filter(d => d.requires_acknowledgment).length}</span>
                        <span className="stat-label">Requires Ack</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs">
                <button className={`tab ${activeTab === 'documents' ? 'active' : ''}`} onClick={() => setActiveTab('documents')}>
                    <FileText size={18} /> Documents
                </button>
                <button className={`tab ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>
                    <Folder size={18} /> Categories
                </button>
                <button className={`tab ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>
                    <Clock size={18} /> Pending <span className="badge-count">{pendingAcks.length}</span>
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <>
                    {activeTab === 'documents' && (
                        <div className="documents-grid">
                            {documents.length === 0 ? (
                                <div className="empty-state">
                                    <FileText size={48} />
                                    <h3>No Documents</h3>
                                    <p>Upload your first document to get started.</p>
                                </div>
                            ) : (
                                documents.map(doc => (
                                    <div key={doc.id} className="document-card">
                                        <div className="document-icon">{getFileIcon(doc.file_type)}</div>
                                        <div className="document-info">
                                            <h4>{doc.name}</h4>
                                            <p className="doc-meta">
                                                <span>{doc.file_type?.toUpperCase()}</span>
                                                <span>{formatFileSize(doc.file_size)}</span>
                                            </p>
                                            {doc.category && <span className="doc-category">{doc.category.name}</span>}
                                            {doc.requires_acknowledgment && (
                                                <span className="ack-badge">
                                                    <CheckCircle size={12} /> Requires Acknowledgment
                                                </span>
                                            )}
                                        </div>
                                        <div className="document-actions">
                                            <button className="btn btn-sm" onClick={() => handleDownload(doc)} title="Download">
                                                <Download size={14} />
                                            </button>
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete('document', doc.id)}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'categories' && (
                        <div className="categories-grid">
                            {categories.map(category => (
                                <div key={category.id} className="category-card">
                                    <div className="category-icon"><Folder size={32} /></div>
                                    <h3>{category.name}</h3>
                                    <p>{category.description || 'No description'}</p>
                                    <div className="card-actions">
                                        <button className="btn btn-sm" onClick={() => openModal('category', category)}><Edit size={14} /></button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete('category', category.id)}><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'pending' && (
                        <div className="pending-list">
                            {pendingAcks.length === 0 ? (
                                <div className="empty-state">
                                    <CheckCircle size={48} />
                                    <h3>All Caught Up!</h3>
                                    <p>No documents pending your acknowledgment.</p>
                                </div>
                            ) : (
                                pendingAcks.map(doc => (
                                    <div key={doc.id} className="pending-card">
                                        <div className="pending-icon">{getFileIcon(doc.file_type)}</div>
                                        <div className="pending-info">
                                            <h4>{doc.name}</h4>
                                            <p>{doc.description || 'Please review and acknowledge this document.'}</p>
                                            {doc.category && <span className="doc-category">{doc.category.name}</span>}
                                        </div>
                                        <div className="pending-actions">
                                            <button className="btn btn-sm" onClick={() => handleDownload(doc)}>
                                                <Eye size={14} /> View
                                            </button>
                                            <button className="btn btn-sm btn-success" onClick={() => handleAcknowledge(doc.id)}>
                                                <CheckCircle size={14} /> Acknowledge
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={`${formData.id ? 'Edit' : 'Add'} ${modalType}`}>
                <form onSubmit={handleSubmit}>
                    {modalType === 'category' && (
                        <>
                            <div className="form-group">
                                <label>Category Name *</label>
                                <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Parent Category</label>
                                <select value={formData.parent_id || ''} onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}>
                                    <option value="">None (Root Category)</option>
                                    {categories.filter(c => c.id !== formData.id).map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3}></textarea>
                            </div>
                        </>
                    )}
                    {modalType === 'document' && (
                        <>
                            <div className="form-group">
                                <label>Document Name *</label>
                                <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select value={formData.category_id || ''} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}>
                                    <option value="">Uncategorized</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>File *</label>
                                <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} required />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3}></textarea>
                            </div>
                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input type="checkbox" checked={formData.requires_acknowledgment || false} onChange={(e) => setFormData({ ...formData, requires_acknowledgment: e.target.checked })} />
                                    Requires Acknowledgment
                                </label>
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
