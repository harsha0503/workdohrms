import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { staffService } from '../services/staffService';
import { organizationService } from '../services/organizationService';
import './StaffForm.css';

export default function StaffForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [locations, setLocations] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [jobTitles, setJobTitles] = useState([]);

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        personal_email: '',
        mobile_number: '',
        birth_date: '',
        gender: 'male',
        hire_date: '',
        base_salary: '',
        office_location_id: '',
        division_id: '',
        job_title_id: '',
        employment_status: 'active'
    });

    useEffect(() => {
        fetchLocations();
        if (id) fetchStaff();
    }, [id]);

    const fetchLocations = async () => {
        try {
            const response = await organizationService.getOfficeLocations();
            setLocations(response.data.data.data || []);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchDivisions = async (locationId) => {
        try {
            const response = await organizationService.fetchDivisionsByLocation(locationId);
            setDivisions(response.data.data || []);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchJobTitles = async (divisionId) => {
        try {
            const response = await organizationService.fetchJobTitlesByDivision(divisionId);
            setJobTitles(response.data.data || []);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchStaff = async () => {
        try {
            const response = await staffService.getStaffById(id);
            const data = response.data.data;
            setFormData({
                full_name: data.full_name,
                email: data.email,
                personal_email: data.personal_email || '',
                mobile_number: data.mobile_number || '',
                birth_date: data.birth_date || '',
                gender: data.gender || 'male',
                hire_date: data.hire_date,
                base_salary: data.base_salary,
                office_location_id: data.office_location_id,
                division_id: data.division_id,
                job_title_id: data.job_title_id,
                employment_status: data.employment_status || 'active'
            });

            if (data.office_location_id) fetchDivisions(data.office_location_id);
            if (data.division_id) fetchJobTitles(data.division_id);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'office_location_id') {
            fetchDivisions(value);
            setFormData(prev => ({ ...prev, division_id: '', job_title_id: '' }));
        } else if (name === 'division_id') {
            fetchJobTitles(value);
            setFormData(prev => ({ ...prev, job_title_id: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (id) {
                await staffService.updateStaff(id, formData);
                alert('Staff updated successfully!');
            } else {
                await staffService.createStaff(formData);
                alert('Staff created successfully!');
            }
            navigate('/staff');
        } catch (error) {
            alert('Error saving staff');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="staff-form-page">
            <div className="page-header">
                <h1>{id ? 'Edit' : 'Add'} Staff Member</h1>
            </div>

            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-section">
                            <h3>Personal Information</h3>

                            <div className="form-group">
                                <label>Full Name*</label>
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Email*</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {!id && (
                                    <div className="form-group">
                                        <label>Password*</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Mobile Number</label>
                                    <input
                                        type="tel"
                                        name="mobile_number"
                                        value={formData.mobile_number}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Birth Date</label>
                                    <input
                                        type="date"
                                        name="birth_date"
                                        value={formData.birth_date}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange}>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3>Employment Details</h3>

                            <div className="form-group">
                                <label>Office Location*</label>
                                <select
                                    name="office_location_id"
                                    value={formData.office_location_id}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Location</option>
                                    {locations.map(loc => (
                                        <option key={loc.id} value={loc.id}>{loc.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Division*</label>
                                <select
                                    name="division_id"
                                    value={formData.division_id}
                                    onChange={handleChange}
                                    required
                                    disabled={!formData.office_location_id}
                                >
                                    <option value="">Select Division</option>
                                    {divisions.map(div => (
                                        <option key={div.id} value={div.id}>{div.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Job Title*</label>
                                <select
                                    name="job_title_id"
                                    value={formData.job_title_id}
                                    onChange={handleChange}
                                    required
                                    disabled={!formData.division_id}
                                >
                                    <option value="">Select Job Title</option>
                                    {jobTitles.map(title => (
                                        <option key={title.id} value={title.id}>{title.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Hire Date*</label>
                                    <input
                                        type="date"
                                        name="hire_date"
                                        value={formData.hire_date}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Base Salary*</label>
                                    <input
                                        type="number"
                                        name="base_salary"
                                        value={formData.base_salary}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Employment Status</label>
                                <select
                                    name="employment_status"
                                    value={formData.employment_status}
                                    onChange={handleChange}
                                >
                                    <option value="active">Active</option>
                                    <option value="on_leave">On Leave</option>
                                    <option value="terminated">Terminated</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={() => navigate('/staff')} className="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Staff Member'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
