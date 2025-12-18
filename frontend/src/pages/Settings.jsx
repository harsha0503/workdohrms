import { useState, useEffect } from 'react';
import {
    Settings as SettingsIcon, Building, Mail, CreditCard, Globe, Shield,
    Bell, FileText, Save, Upload, Trash2, Plus, Check, X
} from 'lucide-react';
import { settingsService } from '../services/settingsService';
import './Settings.css';

export default function Settings() {
    const [activeTab, setActiveTab] = useState('company');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [companySettings, setCompanySettings] = useState({
        company_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        country: '',
        zip_code: '',
        website: '',
        tax_number: '',
    });
    const [systemSettings, setSystemSettings] = useState({
        date_format: 'Y-m-d',
        time_format: 'H:i',
        timezone: 'UTC',
        currency: 'INR',
        currency_symbol: '₹',
        decimal_separator: '.',
        thousand_separator: ',',
    });
    const [emailSettings, setEmailSettings] = useState({
        mail_driver: 'smtp',
        mail_host: '',
        mail_port: '587',
        mail_username: '',
        mail_password: '',
        mail_encryption: 'tls',
        mail_from_address: '',
        mail_from_name: '',
    });
    const [ipRestrictions, setIpRestrictions] = useState([]);
    const [newIP, setNewIP] = useState('');
    const [attendanceSettings, setAttendanceSettings] = useState({
        office_start_time: '09:00',
        office_end_time: '18:00',
        late_mark_after: '15',
        half_day_after: '4',
        enable_geo_fencing: false,
        enable_ip_restriction: false,
        enable_selfie: false,
    });
    const [leaveSettings, setLeaveSettings] = useState({
        leave_year_start: '01',
        carry_forward_leaves: true,
        max_carry_forward: '5',
        probation_leave_allowed: false,
        weekend_between_leave: false,
        holiday_between_leave: false,
    });
    const [notifications, setNotifications] = useState({
        email_notifications: true,
        leave_request_notification: true,
        leave_approval_notification: true,
        attendance_notification: false,
        payslip_notification: true,
        announcement_notification: true,
        meeting_notification: true,
    });

    const tabs = [
        { key: 'company', label: 'Company Settings', icon: Building },
        { key: 'system', label: 'System Settings', icon: SettingsIcon },
        { key: 'email', label: 'Email Settings', icon: Mail },
        { key: 'attendance', label: 'Attendance Settings', icon: Shield },
        { key: 'leave', label: 'Leave Settings', icon: FileText },
        { key: 'ip', label: 'IP Restriction', icon: Shield },
        { key: 'notifications', label: 'Notifications', icon: Bell },
    ];

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setLoading(true);
        try {
            const [company, system, email, attendance, leave, ip] = await Promise.all([
                settingsService.getCompanySettings?.() || Promise.resolve({ data: {} }),
                settingsService.getSystemSettings?.() || Promise.resolve({ data: {} }),
                settingsService.getEmailSettings?.() || Promise.resolve({ data: {} }),
                settingsService.getAttendanceSettings?.() || Promise.resolve({ data: {} }),
                settingsService.getLeaveSettings?.() || Promise.resolve({ data: {} }),
                settingsService.getIPRestrictions?.() || Promise.resolve({ data: [] }),
            ]);

            if (company.data?.data) setCompanySettings(prev => ({ ...prev, ...company.data.data }));
            if (system.data?.data) setSystemSettings(prev => ({ ...prev, ...system.data.data }));
            if (email.data?.data) setEmailSettings(prev => ({ ...prev, ...email.data.data }));
            if (attendance.data?.data) setAttendanceSettings(prev => ({ ...prev, ...attendance.data.data }));
            if (leave.data?.data) setLeaveSettings(prev => ({ ...prev, ...leave.data.data }));
            if (ip.data?.data) setIpRestrictions(ip.data.data);
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            switch (activeTab) {
                case 'company':
                    await settingsService.updateCompanySettings?.(companySettings);
                    break;
                case 'system':
                    await settingsService.updateSystemSettings?.(systemSettings);
                    break;
                case 'email':
                    await settingsService.updateEmailSettings?.(emailSettings);
                    break;
                case 'attendance':
                    await settingsService.updateAttendanceSettings?.(attendanceSettings);
                    break;
                case 'leave':
                    await settingsService.updateLeaveSettings?.(leaveSettings);
                    break;
                case 'notifications':
                    await settingsService.updateNotificationSettings?.(notifications);
                    break;
            }
            alert('Settings saved successfully!');
        } catch (error) {
            alert('Error saving settings');
        } finally {
            setSaving(false);
        }
    };

    const handleAddIP = async () => {
        if (!newIP.trim()) return;
        try {
            await settingsService.addIPRestriction?.({ ip_address: newIP });
            setIpRestrictions([...ipRestrictions, { id: Date.now(), ip_address: newIP }]);
            setNewIP('');
        } catch (error) {
            alert('Error adding IP restriction');
        }
    };

    const handleDeleteIP = async (id) => {
        try {
            await settingsService.deleteIPRestriction?.(id);
            setIpRestrictions(ipRestrictions.filter(ip => ip.id !== id));
        } catch (error) {
            alert('Error removing IP restriction');
        }
    };

    const testEmail = async () => {
        try {
            await settingsService.testEmailSettings?.(emailSettings);
            alert('Test email sent successfully!');
        } catch (error) {
            alert('Failed to send test email');
        }
    };

    const renderCompanySettings = () => (
        <div className="settings-section">
            <h3>Company Information</h3>
            <div className="form-grid">
                <div className="form-group">
                    <label>Company Name *</label>
                    <input type="text" value={companySettings.company_name} onChange={(e) => setCompanySettings({ ...companySettings, company_name: e.target.value })} />
                </div>
                <div className="form-group">
                    <label>Email *</label>
                    <input type="email" value={companySettings.email} onChange={(e) => setCompanySettings({ ...companySettings, email: e.target.value })} />
                </div>
                <div className="form-group">
                    <label>Phone</label>
                    <input type="text" value={companySettings.phone} onChange={(e) => setCompanySettings({ ...companySettings, phone: e.target.value })} />
                </div>
                <div className="form-group">
                    <label>Website</label>
                    <input type="url" value={companySettings.website} onChange={(e) => setCompanySettings({ ...companySettings, website: e.target.value })} />
                </div>
                <div className="form-group full-width">
                    <label>Address</label>
                    <textarea rows={2} value={companySettings.address} onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })} />
                </div>
                <div className="form-group">
                    <label>City</label>
                    <input type="text" value={companySettings.city} onChange={(e) => setCompanySettings({ ...companySettings, city: e.target.value })} />
                </div>
                <div className="form-group">
                    <label>State</label>
                    <input type="text" value={companySettings.state} onChange={(e) => setCompanySettings({ ...companySettings, state: e.target.value })} />
                </div>
                <div className="form-group">
                    <label>Country</label>
                    <input type="text" value={companySettings.country} onChange={(e) => setCompanySettings({ ...companySettings, country: e.target.value })} />
                </div>
                <div className="form-group">
                    <label>Zip Code</label>
                    <input type="text" value={companySettings.zip_code} onChange={(e) => setCompanySettings({ ...companySettings, zip_code: e.target.value })} />
                </div>
                <div className="form-group">
                    <label>Tax Number / GST</label>
                    <input type="text" value={companySettings.tax_number} onChange={(e) => setCompanySettings({ ...companySettings, tax_number: e.target.value })} />
                </div>
            </div>

            <h3>Branding</h3>
            <div className="branding-section">
                <div className="upload-box">
                    <Upload size={32} />
                    <p>Company Logo</p>
                    <span>Click to upload</span>
                </div>
                <div className="upload-box">
                    <Upload size={32} />
                    <p>Favicon</p>
                    <span>Click to upload</span>
                </div>
            </div>
        </div>
    );

    const renderSystemSettings = () => (
        <div className="settings-section">
            <h3>Regional Settings</h3>
            <div className="form-grid">
                <div className="form-group">
                    <label>Date Format</label>
                    <select value={systemSettings.date_format} onChange={(e) => setSystemSettings({ ...systemSettings, date_format: e.target.value })}>
                        <option value="Y-m-d">YYYY-MM-DD</option>
                        <option value="d-m-Y">DD-MM-YYYY</option>
                        <option value="m-d-Y">MM-DD-YYYY</option>
                        <option value="d/m/Y">DD/MM/YYYY</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Time Format</label>
                    <select value={systemSettings.time_format} onChange={(e) => setSystemSettings({ ...systemSettings, time_format: e.target.value })}>
                        <option value="H:i">24 Hour</option>
                        <option value="h:i A">12 Hour</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Timezone</label>
                    <select value={systemSettings.timezone} onChange={(e) => setSystemSettings({ ...systemSettings, timezone: e.target.value })}>
                        <option value="UTC">UTC</option>
                        <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                        <option value="America/New_York">America/New_York (EST)</option>
                        <option value="Europe/London">Europe/London (GMT)</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Currency</label>
                    <select value={systemSettings.currency} onChange={(e) => setSystemSettings({ ...systemSettings, currency: e.target.value })}>
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Currency Symbol</label>
                    <input type="text" value={systemSettings.currency_symbol} onChange={(e) => setSystemSettings({ ...systemSettings, currency_symbol: e.target.value })} />
                </div>
            </div>
        </div>
    );

    const renderEmailSettings = () => (
        <div className="settings-section">
            <h3>SMTP Configuration</h3>
            <div className="form-grid">
                <div className="form-group">
                    <label>Mail Driver</label>
                    <select value={emailSettings.mail_driver} onChange={(e) => setEmailSettings({ ...emailSettings, mail_driver: e.target.value })}>
                        <option value="smtp">SMTP</option>
                        <option value="sendmail">Sendmail</option>
                        <option value="mailgun">Mailgun</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Mail Host</label>
                    <input type="text" value={emailSettings.mail_host} onChange={(e) => setEmailSettings({ ...emailSettings, mail_host: e.target.value })} placeholder="smtp.gmail.com" />
                </div>
                <div className="form-group">
                    <label>Mail Port</label>
                    <input type="text" value={emailSettings.mail_port} onChange={(e) => setEmailSettings({ ...emailSettings, mail_port: e.target.value })} placeholder="587" />
                </div>
                <div className="form-group">
                    <label>Encryption</label>
                    <select value={emailSettings.mail_encryption} onChange={(e) => setEmailSettings({ ...emailSettings, mail_encryption: e.target.value })}>
                        <option value="tls">TLS</option>
                        <option value="ssl">SSL</option>
                        <option value="">None</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" value={emailSettings.mail_username} onChange={(e) => setEmailSettings({ ...emailSettings, mail_username: e.target.value })} />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" value={emailSettings.mail_password} onChange={(e) => setEmailSettings({ ...emailSettings, mail_password: e.target.value })} />
                </div>
                <div className="form-group">
                    <label>From Address</label>
                    <input type="email" value={emailSettings.mail_from_address} onChange={(e) => setEmailSettings({ ...emailSettings, mail_from_address: e.target.value })} />
                </div>
                <div className="form-group">
                    <label>From Name</label>
                    <input type="text" value={emailSettings.mail_from_name} onChange={(e) => setEmailSettings({ ...emailSettings, mail_from_name: e.target.value })} />
                </div>
            </div>
            <button className="btn btn-secondary" onClick={testEmail}>
                <Mail size={16} /> Send Test Email
            </button>
        </div>
    );

    const renderAttendanceSettings = () => (
        <div className="settings-section">
            <h3>Office Timing</h3>
            <div className="form-grid">
                <div className="form-group">
                    <label>Office Start Time</label>
                    <input type="time" value={attendanceSettings.office_start_time} onChange={(e) => setAttendanceSettings({ ...attendanceSettings, office_start_time: e.target.value })} />
                </div>
                <div className="form-group">
                    <label>Office End Time</label>
                    <input type="time" value={attendanceSettings.office_end_time} onChange={(e) => setAttendanceSettings({ ...attendanceSettings, office_end_time: e.target.value })} />
                </div>
                <div className="form-group">
                    <label>Late Mark After (minutes)</label>
                    <input type="number" value={attendanceSettings.late_mark_after} onChange={(e) => setAttendanceSettings({ ...attendanceSettings, late_mark_after: e.target.value })} />
                </div>
                <div className="form-group">
                    <label>Half Day After (hours)</label>
                    <input type="number" value={attendanceSettings.half_day_after} onChange={(e) => setAttendanceSettings({ ...attendanceSettings, half_day_after: e.target.value })} />
                </div>
            </div>

            <h3>Attendance Rules</h3>
            <div className="toggle-list">
                <label className="toggle-item">
                    <input type="checkbox" checked={attendanceSettings.enable_ip_restriction} onChange={(e) => setAttendanceSettings({ ...attendanceSettings, enable_ip_restriction: e.target.checked })} />
                    <span className="toggle-text">Enable IP Restriction for Attendance</span>
                </label>
                <label className="toggle-item">
                    <input type="checkbox" checked={attendanceSettings.enable_geo_fencing} onChange={(e) => setAttendanceSettings({ ...attendanceSettings, enable_geo_fencing: e.target.checked })} />
                    <span className="toggle-text">Enable Geo-Fencing</span>
                </label>
                <label className="toggle-item">
                    <input type="checkbox" checked={attendanceSettings.enable_selfie} onChange={(e) => setAttendanceSettings({ ...attendanceSettings, enable_selfie: e.target.checked })} />
                    <span className="toggle-text">Enable Selfie Verification</span>
                </label>
            </div>
        </div>
    );

    const renderLeaveSettings = () => (
        <div className="settings-section">
            <h3>Leave Policy</h3>
            <div className="form-grid">
                <div className="form-group">
                    <label>Leave Year Starts (Month)</label>
                    <select value={leaveSettings.leave_year_start} onChange={(e) => setLeaveSettings({ ...leaveSettings, leave_year_start: e.target.value })}>
                        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m, i) => (
                            <option key={i} value={String(i + 1).padStart(2, '0')}>{m}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Max Carry Forward Days</label>
                    <input type="number" value={leaveSettings.max_carry_forward} onChange={(e) => setLeaveSettings({ ...leaveSettings, max_carry_forward: e.target.value })} />
                </div>
            </div>

            <div className="toggle-list">
                <label className="toggle-item">
                    <input type="checkbox" checked={leaveSettings.carry_forward_leaves} onChange={(e) => setLeaveSettings({ ...leaveSettings, carry_forward_leaves: e.target.checked })} />
                    <span className="toggle-text">Allow Carry Forward Leaves</span>
                </label>
                <label className="toggle-item">
                    <input type="checkbox" checked={leaveSettings.probation_leave_allowed} onChange={(e) => setLeaveSettings({ ...leaveSettings, probation_leave_allowed: e.target.checked })} />
                    <span className="toggle-text">Allow Leaves During Probation</span>
                </label>
                <label className="toggle-item">
                    <input type="checkbox" checked={leaveSettings.weekend_between_leave} onChange={(e) => setLeaveSettings({ ...leaveSettings, weekend_between_leave: e.target.checked })} />
                    <span className="toggle-text">Count Weekend Between Leaves</span>
                </label>
                <label className="toggle-item">
                    <input type="checkbox" checked={leaveSettings.holiday_between_leave} onChange={(e) => setLeaveSettings({ ...leaveSettings, holiday_between_leave: e.target.checked })} />
                    <span className="toggle-text">Count Holiday Between Leaves</span>
                </label>
            </div>
        </div>
    );

    const renderIPRestriction = () => (
        <div className="settings-section">
            <h3>IP Whitelist</h3>
            <p className="section-description">Only these IP addresses will be allowed to mark attendance.</p>

            <div className="add-ip-form">
                <input type="text" placeholder="Enter IP address (e.g., 192.168.1.1)" value={newIP} onChange={(e) => setNewIP(e.target.value)} />
                <button className="btn btn-primary" onClick={handleAddIP}><Plus size={16} /> Add IP</button>
            </div>

            <div className="ip-list">
                {ipRestrictions.length === 0 ? (
                    <div className="empty-state">No IP restrictions configured</div>
                ) : (
                    ipRestrictions.map(ip => (
                        <div key={ip.id} className="ip-item">
                            <span className="ip-address">{ip.ip_address}</span>
                            <button className="btn btn-icon btn-ghost btn-sm" onClick={() => handleDeleteIP(ip.id)}><Trash2 size={16} /></button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    const renderNotifications = () => (
        <div className="settings-section">
            <h3>Email Notifications</h3>
            <div className="toggle-list">
                <label className="toggle-item">
                    <input type="checkbox" checked={notifications.email_notifications} onChange={(e) => setNotifications({ ...notifications, email_notifications: e.target.checked })} />
                    <span className="toggle-text">Enable Email Notifications</span>
                </label>
                <label className="toggle-item">
                    <input type="checkbox" checked={notifications.leave_request_notification} onChange={(e) => setNotifications({ ...notifications, leave_request_notification: e.target.checked })} />
                    <span className="toggle-text">Leave Request Notification</span>
                </label>
                <label className="toggle-item">
                    <input type="checkbox" checked={notifications.leave_approval_notification} onChange={(e) => setNotifications({ ...notifications, leave_approval_notification: e.target.checked })} />
                    <span className="toggle-text">Leave Approval Notification</span>
                </label>
                <label className="toggle-item">
                    <input type="checkbox" checked={notifications.attendance_notification} onChange={(e) => setNotifications({ ...notifications, attendance_notification: e.target.checked })} />
                    <span className="toggle-text">Attendance Notification</span>
                </label>
                <label className="toggle-item">
                    <input type="checkbox" checked={notifications.payslip_notification} onChange={(e) => setNotifications({ ...notifications, payslip_notification: e.target.checked })} />
                    <span className="toggle-text">Payslip Notification</span>
                </label>
                <label className="toggle-item">
                    <input type="checkbox" checked={notifications.announcement_notification} onChange={(e) => setNotifications({ ...notifications, announcement_notification: e.target.checked })} />
                    <span className="toggle-text">Announcement Notification</span>
                </label>
                <label className="toggle-item">
                    <input type="checkbox" checked={notifications.meeting_notification} onChange={(e) => setNotifications({ ...notifications, meeting_notification: e.target.checked })} />
                    <span className="toggle-text">Meeting Notification</span>
                </label>
            </div>
        </div>
    );

    const renderContent = () => {
        if (loading) return <div className="loading">Loading settings...</div>;

        switch (activeTab) {
            case 'company': return renderCompanySettings();
            case 'system': return renderSystemSettings();
            case 'email': return renderEmailSettings();
            case 'attendance': return renderAttendanceSettings();
            case 'leave': return renderLeaveSettings();
            case 'ip': return renderIPRestriction();
            case 'notifications': return renderNotifications();
            default: return null;
        }
    };

    return (
        <div className="settings-page">
            <div className="page-header">
                <div>
                    <h1>Settings</h1>
                    <p className="breadcrumb">System Configuration</p>
                </div>
            </div>

            <div className="settings-layout">
                {/* Sidebar */}
                <div className="settings-sidebar">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.key}
                                className={`settings-tab ${activeTab === tab.key ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                <Icon size={18} />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="settings-content">
                    <div className="settings-card">
                        {renderContent()}

                        {activeTab !== 'ip' && (
                            <div className="settings-actions">
                                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                                    <Save size={16} />
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
