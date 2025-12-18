import { useState, useEffect } from 'react';
import { Plus, Upload, FolderPlus, Trash2, Download, Eye, Grid, List, Image, FileText, Video, File, Folder } from 'lucide-react';
import mediaService from '../services/mediaService';
import Modal from '../components/Modal';
import './MediaLibrary.css';

export default function MediaLibrary() {
    const [files, setFiles] = useState([]);
    const [directories, setDirectories] = useState([]);
    const [currentDirectory, setCurrentDirectory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [formData, setFormData] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        loadData();
    }, [currentDirectory]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [filesRes, dirsRes] = await Promise.all([
                mediaService.getFiles({ directory_id: currentDirectory }),
                mediaService.getDirectories()
            ]);
            setFiles(filesRes.data.data?.data || filesRes.data.data || []);
            setDirectories(dirsRes.data.data || []);
        } catch (error) {
            console.error('Error loading media:', error);
        }
        setLoading(false);
    };

    const openModal = (type, data = {}) => {
        setModalType(type);
        setFormData(data);
        setSelectedFile(null);
        setShowModal(true);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) return;

        try {
            const fd = new FormData();
            fd.append('file', selectedFile);
            fd.append('name', formData.name || selectedFile.name);
            if (currentDirectory) fd.append('directory_id', currentDirectory);
            if (formData.description) fd.append('description', formData.description);

            await mediaService.uploadFile(fd);
            setShowModal(false);
            loadData();
        } catch (error) {
            console.error('Error uploading:', error);
        }
    };

    const handleCreateDirectory = async (e) => {
        e.preventDefault();
        try {
            await mediaService.createDirectory({
                name: formData.name,
                parent_id: currentDirectory
            });
            setShowModal(false);
            loadData();
        } catch (error) {
            console.error('Error creating directory:', error);
        }
    };

    const handleDelete = async (id, isDirectory = false) => {
        if (!confirm('Are you sure?')) return;
        try {
            if (isDirectory) {
                await mediaService.deleteDirectory(id);
            } else {
                await mediaService.deleteFile(id);
            }
            loadData();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedItems.length === 0) return;
        if (!confirm(`Delete ${selectedItems.length} items?`)) return;

        try {
            await Promise.all(selectedItems.map(item =>
                item.type === 'directory'
                    ? mediaService.deleteDirectory(item.id)
                    : mediaService.deleteFile(item.id)
            ));
            setSelectedItems([]);
            loadData();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const getFileIcon = (mimeType) => {
        if (!mimeType) return File;
        if (mimeType.startsWith('image/')) return Image;
        if (mimeType.startsWith('video/')) return Video;
        if (mimeType.includes('pdf') || mimeType.includes('document')) return FileText;
        return File;
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const toggleSelect = (item) => {
        setSelectedItems(prev => {
            const exists = prev.find(i => i.id === item.id && i.type === item.type);
            if (exists) {
                return prev.filter(i => !(i.id === item.id && i.type === item.type));
            }
            return [...prev, item];
        });
    };

    const isSelected = (item) => {
        return selectedItems.some(i => i.id === item.id && i.type === item.type);
    };

    const currentDirs = directories.filter(d =>
        currentDirectory ? d.parent_id === currentDirectory : !d.parent_id
    );

    // Breadcrumb
    const getBreadcrumb = () => {
        if (!currentDirectory) return [];
        const crumbs = [];
        let dir = directories.find(d => d.id === currentDirectory);
        while (dir) {
            crumbs.unshift(dir);
            dir = directories.find(d => d.id === dir.parent_id);
        }
        return crumbs;
    };

    return (
        <div className="media-library-page">
            <div className="page-header">
                <div>
                    <h1>Media Library</h1>
                    <div className="breadcrumb-nav">
                        <button className="breadcrumb-btn" onClick={() => setCurrentDirectory(null)}>
                            Root
                        </button>
                        {getBreadcrumb().map(dir => (
                            <span key={dir.id}>
                                <span className="breadcrumb-sep">/</span>
                                <button className="breadcrumb-btn" onClick={() => setCurrentDirectory(dir.id)}>
                                    {dir.name}
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
                <div className="header-actions">
                    <div className="view-toggle">
                        <button className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
                            <Grid size={18} />
                        </button>
                        <button className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
                            <List size={18} />
                        </button>
                    </div>
                    {selectedItems.length > 0 && (
                        <button className="btn btn-danger" onClick={handleDeleteSelected}>
                            <Trash2 size={18} /> Delete ({selectedItems.length})
                        </button>
                    )}
                    <button className="btn btn-secondary" onClick={() => openModal('directory')}>
                        <FolderPlus size={18} /> New Folder
                    </button>
                    <button className="btn btn-primary" onClick={() => openModal('upload')}>
                        <Upload size={18} /> Upload
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card blue">
                    <div className="stat-icon"><File size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{files.length}</span>
                        <span className="stat-label">Files</span>
                    </div>
                </div>
                <div className="stat-card purple">
                    <div className="stat-icon"><Folder size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{directories.length}</span>
                        <span className="stat-label">Folders</span>
                    </div>
                </div>
                <div className="stat-card green">
                    <div className="stat-icon"><Image size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{files.filter(f => f.mime_type?.startsWith('image/')).length}</span>
                        <span className="stat-label">Images</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <div className={`media-content ${viewMode}`}>
                    {/* Directories */}
                    {currentDirs.map(dir => (
                        <div
                            key={`dir-${dir.id}`}
                            className={`media-item directory ${isSelected({ id: dir.id, type: 'directory' }) ? 'selected' : ''}`}
                            onClick={() => toggleSelect({ id: dir.id, type: 'directory' })}
                            onDoubleClick={() => setCurrentDirectory(dir.id)}
                        >
                            <div className="item-icon folder-icon">
                                <Folder size={viewMode === 'grid' ? 48 : 24} />
                            </div>
                            <div className="item-info">
                                <span className="item-name">{dir.name}</span>
                                <span className="item-meta">Folder</span>
                            </div>
                            <div className="item-actions">
                                <button className="btn btn-sm btn-danger" onClick={(e) => { e.stopPropagation(); handleDelete(dir.id, true); }}>
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Files */}
                    {files.map(file => {
                        const FileIcon = getFileIcon(file.mime_type);
                        return (
                            <div
                                key={`file-${file.id}`}
                                className={`media-item file ${isSelected({ id: file.id, type: 'file' }) ? 'selected' : ''}`}
                                onClick={() => toggleSelect({ id: file.id, type: 'file' })}
                            >
                                <div className="item-icon">
                                    {file.mime_type?.startsWith('image/') && file.url ? (
                                        <img src={file.url} alt={file.name} className="thumbnail" />
                                    ) : (
                                        <FileIcon size={viewMode === 'grid' ? 48 : 24} />
                                    )}
                                </div>
                                <div className="item-info">
                                    <span className="item-name">{file.name || file.original_name}</span>
                                    <span className="item-meta">{formatFileSize(file.size)}</span>
                                </div>
                                <div className="item-actions">
                                    <button className="btn btn-sm" title="Download">
                                        <Download size={14} />
                                    </button>
                                    <button className="btn btn-sm btn-danger" onClick={(e) => { e.stopPropagation(); handleDelete(file.id); }}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    {currentDirs.length === 0 && files.length === 0 && (
                        <div className="empty-state">
                            <Folder size={48} />
                            <h3>Empty Folder</h3>
                            <p>Upload files or create a new folder to get started.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Upload Modal */}
            <Modal isOpen={showModal && modalType === 'upload'} onClose={() => setShowModal(false)} title="Upload File">
                <form onSubmit={handleUpload}>
                    <div className="form-group">
                        <label>File *</label>
                        <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} required />
                    </div>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Optional - uses filename if empty" />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3}></textarea>
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Upload</button>
                    </div>
                </form>
            </Modal>

            {/* Create Directory Modal */}
            <Modal isOpen={showModal && modalType === 'directory'} onClose={() => setShowModal(false)} title="Create Folder">
                <form onSubmit={handleCreateDirectory}>
                    <div className="form-group">
                        <label>Folder Name *</label>
                        <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Create</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
