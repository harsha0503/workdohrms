import { useState, useEffect } from 'react';
import { Plus, Calendar, Edit2, Trash2, Download, Upload, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { holidayService } from '../services/holidayService';
import Modal from '../components/Modal';
import './Holidays.css';

export default function Holidays() {
    const [holidays, setHolidays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingHoliday, setEditingHoliday] = useState(null);
    const [formData, setFormData] = useState({ name: '', date: '', description: '' });
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'

    useEffect(() => {
        loadHolidays();
    }, [currentMonth]);

    const loadHolidays = async () => {
        try {
            const year = currentMonth.getFullYear();
            const month = currentMonth.getMonth() + 1;
            const response = await holidayService.getHolidays({ year, month });
            setHolidays(response.data.data || response.data || []);
        } catch (error) {
            console.error('Error loading holidays:', error);
            // Mock data for demo
            setHolidays([
                { id: 1, name: 'New Year', date: '2024-01-01', description: 'Public Holiday' },
                { id: 2, name: 'Republic Day', date: '2024-01-26', description: 'National Holiday' },
                { id: 3, name: 'Holi', date: '2024-03-25', description: 'Festival' },
                { id: 4, name: 'Good Friday', date: '2024-03-29', description: 'Public Holiday' },
                { id: 5, name: 'Independence Day', date: '2024-08-15', description: 'National Holiday' },
                { id: 6, name: 'Diwali', date: '2024-11-01', description: 'Festival' },
                { id: 7, name: 'Christmas', date: '2024-12-25', description: 'Public Holiday' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingHoliday) {
                await holidayService.updateHoliday(editingHoliday.id, formData);
            } else {
                await holidayService.createHoliday(formData);
            }
            setShowModal(false);
            setFormData({ name: '', date: '', description: '' });
            setEditingHoliday(null);
            loadHolidays();
        } catch (error) {
            alert('Error saving holiday');
        }
    };

    const handleEdit = (holiday) => {
        setEditingHoliday(holiday);
        setFormData({ name: holiday.name, date: holiday.date, description: holiday.description || '' });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this holiday?')) {
            try {
                await holidayService.deleteHoliday(id);
                loadHolidays();
            } catch (error) {
                alert('Error deleting holiday');
            }
        }
    };

    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv,.xlsx';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    await holidayService.importHolidays(file);
                    loadHolidays();
                    alert('Holidays imported successfully!');
                } catch (error) {
                    alert('Error importing holidays');
                }
            }
        };
        input.click();
    };

    const handleExport = async () => {
        try {
            const response = await holidayService.exportHolidays();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'holidays.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert('Error exporting holidays');
        }
    };

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const isHoliday = (day) => {
        const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return holidays.find(h => h.date === dateStr);
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentMonth);
        const firstDay = getFirstDayOfMonth(currentMonth);
        const days = [];

        // Empty cells for days before the first day
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const holiday = isHoliday(day);
            const isWeekend = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).getDay() % 6 === 0;

            days.push(
                <div
                    key={day}
                    className={`calendar-day ${holiday ? 'holiday' : ''} ${isWeekend ? 'weekend' : ''}`}
                >
                    <span className="day-number">{day}</span>
                    {holiday && (
                        <div className="holiday-label" title={holiday.name}>
                            {holiday.name}
                        </div>
                    )}
                </div>
            );
        }

        return days;
    };

    return (
        <div className="holidays-page">
            <div className="page-header">
                <div>
                    <h1>Holidays</h1>
                    <p className="breadcrumb">HR Admin &gt; Holidays</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-outline" onClick={handleImport}>
                        <Upload size={16} /> Import
                    </button>
                    <button className="btn btn-outline" onClick={handleExport}>
                        <Download size={16} /> Export
                    </button>
                    <button className="btn btn-primary" onClick={() => { setEditingHoliday(null); setFormData({ name: '', date: '', description: '' }); setShowModal(true); }}>
                        <Plus size={16} /> Add Holiday
                    </button>
                </div>
            </div>

            {/* View Toggle & Month Navigation */}
            <div className="calendar-header">
                <div className="month-nav">
                    <button className="btn btn-icon btn-ghost" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
                        <ChevronLeft size={20} />
                    </button>
                    <h2>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                    <button className="btn btn-icon btn-ghost" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
                        <ChevronRight size={20} />
                    </button>
                </div>
                <div className="view-toggle">
                    <button className={`btn btn-ghost ${viewMode === 'calendar' ? 'active' : ''}`} onClick={() => setViewMode('calendar')}>
                        <Calendar size={16} /> Calendar
                    </button>
                    <button className={`btn btn-ghost ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
                        List
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="loading">Loading holidays...</div>
            ) : viewMode === 'calendar' ? (
                <div className="calendar-container">
                    <div className="calendar-grid">
                        <div className="calendar-weekday">Sun</div>
                        <div className="calendar-weekday">Mon</div>
                        <div className="calendar-weekday">Tue</div>
                        <div className="calendar-weekday">Wed</div>
                        <div className="calendar-weekday">Thu</div>
                        <div className="calendar-weekday">Fri</div>
                        <div className="calendar-weekday">Sat</div>
                        {renderCalendar()}
                    </div>
                </div>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Holiday Name</th>
                                <th>Date</th>
                                <th>Day</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {holidays.length === 0 ? (
                                <tr><td colSpan="6" className="empty-row">No holidays found</td></tr>
                            ) : (
                                holidays.map((holiday, index) => (
                                    <tr key={holiday.id}>
                                        <td>{index + 1}</td>
                                        <td><strong>{holiday.name}</strong></td>
                                        <td>{new Date(holiday.date).toLocaleDateString()}</td>
                                        <td>{new Date(holiday.date).toLocaleDateString('en', { weekday: 'long' })}</td>
                                        <td>{holiday.description || '-'}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button className="btn btn-icon btn-ghost btn-sm" onClick={() => handleEdit(holiday)}>
                                                    <Edit2 size={16} />
                                                </button>
                                                <button className="btn btn-icon btn-ghost btn-sm text-danger" onClick={() => handleDelete(holiday.id)}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add/Edit Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingHoliday ? 'Edit Holiday' : 'Add Holiday'}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Holiday Name *</label>
                        <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Date *</label>
                        <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">{editingHoliday ? 'Update' : 'Create'}</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
