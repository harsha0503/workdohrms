import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package, Laptop, Tag, User, AlertCircle, CheckCircle } from 'lucide-react';
import assetService from '../services/assetService';
import Modal from '../components/Modal';
import './Assets.css';

export default function Assets() {
    const [activeTab, setActiveTab] = useState('assets');
    const [assets, setAssets] = useState([]);
    const [types, setTypes] = useState([]);
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
            const typesRes = await assetService.getAssetTypes();
            setTypes(typesRes.data.data || []);

            if (activeTab === 'assets') {
                const res = await assetService.getAssets();
                setAssets(res.data.data?.data || res.data.data || []);
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
            if (modalType === 'asset') {
                if (formData.id) {
                    await assetService.updateAsset(formData.id, formData);
                } else {
                    await assetService.createAsset(formData);
                }
            } else if (modalType === 'type') {
                if (formData.id) {
                    await assetService.updateAssetType(formData.id, formData);
                } else {
                    await assetService.createAssetType(formData);
                }
            } else if (modalType === 'assign') {
                await assetService.assignAsset(formData.asset_id, formData);
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
            if (type === 'asset') await assetService.deleteAsset(id);
            else if (type === 'type') await assetService.deleteAssetType(id);
            loadData();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleReturn = async (assetId) => {
        if (!confirm('Return this asset?')) return;
        try {
            await assetService.returnAsset(assetId, { return_date: new Date().toISOString().split('T')[0] });
            loadData();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const filteredAssets = assets.filter(a =>
        a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.serial_number?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="assets-page">
            <div className="page-header">
                <div>
                    <h1>Asset Management</h1>
                    <p className="breadcrumb">HR Management &gt; Assets</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-secondary" onClick={() => openModal('type')}>
                        <Tag size={18} /> Add Type
                    </button>
                    <button className="btn btn-primary" onClick={() => openModal('asset')}>
                        <Plus size={18} /> Add Asset
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card blue">
                    <div className="stat-icon"><Package size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{assets.length}</span>
                        <span className="stat-label">Total Assets</span>
                    </div>
                </div>
                <div className="stat-card green">
                    <div className="stat-icon"><CheckCircle size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{assets.filter(a => !a.assigned_to).length}</span>
                        <span className="stat-label">Available</span>
                    </div>
                </div>
                <div className="stat-card orange">
                    <div className="stat-icon"><User size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{assets.filter(a => a.assigned_to).length}</span>
                        <span className="stat-label">Assigned</span>
                    </div>
                </div>
                <div className="stat-card purple">
                    <div className="stat-icon"><Tag size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{types.length}</span>
                        <span className="stat-label">Asset Types</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs">
                <button className={`tab ${activeTab === 'assets' ? 'active' : ''}`} onClick={() => setActiveTab('assets')}>
                    <Laptop size={18} /> Assets
                </button>
                <button className={`tab ${activeTab === 'types' ? 'active' : ''}`} onClick={() => setActiveTab('types')}>
                    <Tag size={18} /> Asset Types
                </button>
            </div>

            {/* Search */}
            <div className="table-header">
                <input
                    type="text"
                    placeholder="Search assets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            {/* Content */}
            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <>
                    {activeTab === 'assets' && (
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Asset Name</th>
                                        <th>Type</th>
                                        <th>Serial Number</th>
                                        <th>Purchase Date</th>
                                        <th>Assigned To</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAssets.length === 0 ? (
                                        <tr><td colSpan={8} className="empty-row">No assets found</td></tr>
                                    ) : (
                                        filteredAssets.map((asset, index) => (
                                            <tr key={asset.id}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <div className="asset-name">
                                                        <Laptop size={16} />
                                                        {asset.name}
                                                    </div>
                                                </td>
                                                <td>{asset.asset_type?.name || '-'}</td>
                                                <td>{asset.serial_number || '-'}</td>
                                                <td>{asset.purchase_date ? new Date(asset.purchase_date).toLocaleDateString() : '-'}</td>
                                                <td>
                                                    {asset.current_assignment?.staff_member?.full_name || (
                                                        <span className="text-muted">Not Assigned</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <span className={`badge ${asset.status === 'available' ? 'badge-success' : asset.status === 'assigned' ? 'badge-info' : 'badge-warning'}`}>
                                                        {asset.status || 'Available'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        {!asset.assigned_to && (
                                                            <button className="btn btn-sm btn-success" onClick={() => openModal('assign', { asset_id: asset.id })} title="Assign">
                                                                <User size={14} />
                                                            </button>
                                                        )}
                                                        {asset.assigned_to && (
                                                            <button className="btn btn-sm btn-warning" onClick={() => handleReturn(asset.id)} title="Return">
                                                                <AlertCircle size={14} />
                                                            </button>
                                                        )}
                                                        <button className="btn btn-sm" onClick={() => openModal('asset', asset)}><Edit size={14} /></button>
                                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete('asset', asset.id)}><Trash2 size={14} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'types' && (
                        <div className="types-grid">
                            {types.map(type => (
                                <div key={type.id} className="type-card">
                                    <div className="type-icon"><Tag size={24} /></div>
                                    <h3>{type.name}</h3>
                                    <p>{type.description || 'No description'}</p>
                                    <div className="type-actions">
                                        <button className="btn btn-sm" onClick={() => openModal('type', type)}><Edit size={14} /></button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete('type', type.id)}><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={modalType === 'assign' ? 'Assign Asset' : `${formData.id ? 'Edit' : 'Add'} ${modalType}`}>
                <form onSubmit={handleSubmit}>
                    {modalType === 'type' && (
                        <>
                            <div className="form-group">
                                <label>Type Name *</label>
                                <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3}></textarea>
                            </div>
                        </>
                    )}
                    {modalType === 'asset' && (
                        <>
                            <div className="form-group">
                                <label>Asset Name *</label>
                                <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Asset Type *</label>
                                <select value={formData.asset_type_id || ''} onChange={(e) => setFormData({ ...formData, asset_type_id: e.target.value })} required>
                                    <option value="">Select Type</option>
                                    {types.map(type => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Serial Number</label>
                                    <input type="text" value={formData.serial_number || ''} onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Purchase Date</label>
                                    <input type="date" value={formData.purchase_date || ''} onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Purchase Cost</label>
                                    <input type="number" value={formData.purchase_cost || ''} onChange={(e) => setFormData({ ...formData, purchase_cost: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Warranty Until</label>
                                    <input type="date" value={formData.warranty_expiry || ''} onChange={(e) => setFormData({ ...formData, warranty_expiry: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Notes</label>
                                <textarea value={formData.notes || ''} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3}></textarea>
                            </div>
                        </>
                    )}
                    {modalType === 'assign' && (
                        <>
                            <div className="form-group">
                                <label>Employee ID *</label>
                                <input type="number" value={formData.staff_member_id || ''} onChange={(e) => setFormData({ ...formData, staff_member_id: e.target.value })} required placeholder="Enter staff member ID" />
                            </div>
                            <div className="form-group">
                                <label>Assignment Date *</label>
                                <input type="date" value={formData.assigned_date || new Date().toISOString().split('T')[0]} onChange={(e) => setFormData({ ...formData, assigned_date: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Notes</label>
                                <textarea value={formData.notes || ''} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={2}></textarea>
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
