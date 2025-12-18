import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Clock, Users, Check } from 'lucide-react';
import { attendanceService } from '../services/attendanceService';
import Modal from '../components/Modal';
import './Shifts.css';

export default function Shifts() {
    const [shifts, setShifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingShift, setEditingShift] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        start_time: '09:00',
        end_time: '18:00',
        break_duration: 60,
        is_default: false,
        color: '#6366f1'
    });

    useEffect(() => {
        loadShifts();
    }, []);

    const loadShifts = async () => {
        try {
            const response = await attendanceService.getShifts?.() || { data: [] };
            setShifts(response.data.data || response.data || []);
        } catch (error) {
            console.error('Error:', error);
            // Mock data
            setShifts([
                { id: 1, name: 'Morning Shift', start_time: '06:00', end_time: '14:00', break_duration: 60, is_default: false, color: '#10b981', employees_count: 12 },
                { id: 2, name: 'Day Shift', start_time: '09:00', end_time: '18:00', break_duration: 60, is_default: true, color: '#6366f1', employees_count: 28 },
                { id: 3, name: 'Evening Shift', start_time: '14:00', end_time: '22:00', break_duration: 60, is_default: false, color: '#f97316', employees_count: 8 },
                { id: 4, name: 'Night Shift', start_time: '22:00', end_time: '06:00', break_duration: 60, is_default: false, color: '#8b5cf6', employees_count: 5 },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingShift) {
                await attendanceService.updateShift?.(editingShift.id, formData);
            } else {
                await attendanceService.createShift?.(formData);
            }
            setShowModal(false);
            resetForm();
            loadShifts();
        } catch (error) {
            alert('Error saving shift');
        }
    };

    const handleEdit = (shift) => {
        setEditingShift(shift);
        setFormData({
            name: shift.name,
            start_time: shift.start_time,
            end_time: shift.end_time,
            break_duration: shift.break_duration,
            is_default: shift.is_default,
            color: shift.color || '#6366f1'
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this shift?')) {
            try {
                await attendanceService.deleteShift?.(id);
                loadShifts();
            } catch (error) {
                alert('Error deleting shift');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            start_time: '09:00',
            end_time: '18:00',
            break_duration: 60,
            is_default: false,
            color: '#6366f1'
        });
        setEditingShift(null);
    };

    const calculateDuration = (start, end) => {
        const startParts = start.split(':');
        const endParts = end.split(':');
        let hours = parseInt(endParts[0]) - parseInt(startParts[0]);
        if (hours < 0) hours += 24;
        return hours;
    };

    return (
        <div className="shifts-page">
            <div className="page-header">
                <div>
                    <h1>Shift Management</h1>
                    <p className="breadcrumb">Leave & Attendance &gt; Shifts</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
                        <Plus size={16} /> Add Shift
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid mini">
                <div className="stat-card blue">
                    <div className="stat-icon"><Clock size={20} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{shifts.length}</span>
                        <span className="stat-label">Total Shifts</span>
                    </div>
                </div>
                <div className="stat-card green">
                    <div className="stat-icon"><Users size={20} /></div>
                    <div className="stat-info">
                        <span className="stat-value">{shifts.reduce((sum, s) => sum + (s.employees_count || 0), 0)}</span>
                        <span className="stat-label">Assigned Employees</span>
                    </div>
                </div>
            </div>

            {/* Shifts Grid */}
            {loading ? (
                <div className="loading">Loading shifts...</div>
            ) : (
                <div className="shifts-grid">
                    {shifts.length === 0 ? (
                        <div className="empty-state">
                            <Clock size={48} />
                            <p>No shifts configured</p>
                            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                                Create First Shift
                            </button>
                        </div>
                    ) : (
                        shifts.map(shift => (
                            <div key={shift.id} className="shift-card" style={{ '--shift-color': shift.color }}>
                                <div className="shift-header">
                                    <div className="shift-color-indicator"></div>
                                    <div className="shift-info">
                                        <h3>{shift.name}</h3>
                                        {shift.is_default && <span className="badge badge-success">Default</span>}
                                    </div>
                                </div>
                                <div className="shift-body">
                                    <div className="time-block">
                                        <div className="time-item">
                                            <span className="label">Start</span>
                                            <span className="value">{shift.start_time}</span>
                                        </div>
                                        <div className="time-arrow">→</div>
                                        <div className="time-item">
                                            <span className="label">End</span>
                                            <span className="value">{shift.end_time}</span>
                                        </div>
                                    </div>
                                    <div className="shift-meta">
                                        <span><Clock size={14} /> {calculateDuration(shift.start_time, shift.end_time)} hours</span>
                                        <span><Users size={14} /> {shift.employees_count || 0} employees</span>
                                    </div>
                                </div>
                                <div className="shift-actions">
                                    <button className="btn btn-icon btn-ghost btn-sm" onClick={() => handleEdit(shift)}>
                                        <Edit2 size={16} />
                                    </button>
                                    <button className="btn btn-icon btn-ghost btn-sm text-danger" onClick={() => handleDelete(shift.id)}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingShift ? 'Edit Shift' : 'Add Shift'}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Shift Name *</label>
                        <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Start Time *</label>
                            <input type="time" value={formData.start_time} onChange={(e) => setFormData({ ...formData, start_time: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>End Time *</label>
                            <input type="time" value={formData.end_time} onChange={(e) => setFormData({ ...formData, end_time: e.target.value })} required />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Break Duration (minutes)</label>
                            <input type="number" value={formData.break_duration} onChange={(e) => setFormData({ ...formData, break_duration: parseInt(e.target.value) })} />
                        </div>
                        <div className="form-group">
                            <label>Color</label>
                            <input type="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="checkbox-label">
                            <input type="checkbox" checked={formData.is_default} onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })} />
                            <span>Set as default shift</span>
                        </label>
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">{editingShift ? 'Update' : 'Create'}</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
