import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, DollarSign, ArrowLeft, Save, TrendingUp, TrendingDown, Percent, Calculator } from 'lucide-react';
import api from '../services/api';
import Modal from '../components/Modal';
import './SetSalary.css';

export default function SetSalary() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [salaryData, setSalaryData] = useState({
        basic_salary: 0,
        allowances: [],
        commissions: [],
        loans: [],
        deductions: [],
        overtime: [],
        other_payments: [],
        company_contributions: []
    });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [formData, setFormData] = useState({});
    const [options, setOptions] = useState({
        allowanceOptions: [],
        loanOptions: [],
        deductionOptions: [],
    });

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [empRes, salaryRes, optRes] = await Promise.all([
                api.get(`/staff-members/${id}`),
                api.get(`/staff-members/${id}/salary`),
                Promise.all([
                    api.get('/allowance-options'),
                    api.get('/loan-options'),
                    api.get('/deduction-options')
                ])
            ]);
            setEmployee(empRes.data.data);
            setSalaryData(salaryRes.data.data || {
                basic_salary: empRes.data.data?.salary || 0,
                allowances: [],
                commissions: [],
                loans: [],
                deductions: [],
                overtime: [],
                other_payments: [],
                company_contributions: []
            });
            setOptions({
                allowanceOptions: optRes[0].data.data || [],
                loanOptions: optRes[1].data.data || [],
                deductionOptions: optRes[2].data.data || []
            });
        } catch (error) {
            console.error('Error loading data:', error);
        }
        setLoading(false);
    };

    const openModal = (type, item = {}) => {
        setModalType(type);
        setFormData(item);
        setShowModal(true);
    };

    const handleSaveBasicSalary = async () => {
        try {
            await api.put(`/staff-members/${id}/salary`, { basic_salary: salaryData.basic_salary });
            alert('Basic salary updated!');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoints = {
                allowance: `/staff-members/${id}/allowances`,
                commission: `/staff-members/${id}/commissions`,
                loan: `/staff-members/${id}/loans`,
                deduction: `/staff-members/${id}/deductions`,
                overtime: `/staff-members/${id}/overtime`,
                otherPayment: `/staff-members/${id}/other-payments`,
                contribution: `/staff-members/${id}/company-contributions`
            };

            if (formData.id) {
                await api.put(`${endpoints[modalType]}/${formData.id}`, formData);
            } else {
                await api.post(endpoints[modalType], formData);
            }
            setShowModal(false);
            loadData();
        } catch (error) {
            console.error('Error saving:', error);
        }
    };

    const handleDelete = async (type, itemId) => {
        if (!confirm('Are you sure?')) return;
        try {
            const endpoints = {
                allowance: 'allowances',
                commission: 'commissions',
                loan: 'loans',
                deduction: 'deductions',
                overtime: 'overtime',
                otherPayment: 'other-payments',
                contribution: 'company-contributions'
            };
            await api.delete(`/staff-members/${id}/${endpoints[type]}/${itemId}`);
            loadData();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const calculateTotals = () => {
        const totalAllowances = (salaryData.allowances || []).reduce((sum, a) => sum + parseFloat(a.amount || 0), 0);
        const totalCommissions = (salaryData.commissions || []).reduce((sum, c) => sum + parseFloat(c.amount || 0), 0);
        const totalOvertime = (salaryData.overtime || []).reduce((sum, o) => sum + parseFloat(o.amount || 0), 0);
        const totalOther = (salaryData.other_payments || []).reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
        const totalDeductions = (salaryData.deductions || []).reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);
        const totalLoans = (salaryData.loans || []).reduce((sum, l) => sum + parseFloat(l.monthly_payment || l.amount || 0), 0);

        const grossSalary = parseFloat(salaryData.basic_salary || 0) + totalAllowances + totalCommissions + totalOvertime + totalOther;
        const netSalary = grossSalary - totalDeductions - totalLoans;

        return { totalAllowances, totalCommissions, totalOvertime, totalOther, totalDeductions, totalLoans, grossSalary, netSalary };
    };

    const totals = calculateTotals();

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="set-salary-page">
            <div className="page-header">
                <div>
                    <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>
                        <ArrowLeft size={16} /> Back
                    </button>
                    <h1>Set Salary - {employee?.full_name}</h1>
                    <p className="breadcrumb">Payroll &gt; Set Salary</p>
                </div>
            </div>

            {/* Employee Info */}
            <div className="employee-salary-card">
                <div className="employee-info-row">
                    <div className="avatar large">{employee?.full_name?.charAt(0)}</div>
                    <div className="employee-details">
                        <h2>{employee?.full_name}</h2>
                        <p>{employee?.designation?.name} - {employee?.department?.name}</p>
                        <p className="email">{employee?.email}</p>
                    </div>
                </div>
            </div>

            {/* Salary Summary */}
            <div className="salary-summary">
                <div className="summary-card basic">
                    <h3>Basic Salary</h3>
                    <div className="summary-input">
                        <span className="currency">₹</span>
                        <input
                            type="number"
                            value={salaryData.basic_salary || ''}
                            onChange={(e) => setSalaryData({ ...salaryData, basic_salary: e.target.value })}
                        />
                        <button className="btn btn-primary btn-sm" onClick={handleSaveBasicSalary}><Save size={14} /></button>
                    </div>
                </div>
                <div className="summary-card earnings">
                    <h3>Gross Salary</h3>
                    <span className="amount">₹{totals.grossSalary.toLocaleString()}</span>
                </div>
                <div className="summary-card deductions">
                    <h3>Total Deductions</h3>
                    <span className="amount">₹{(totals.totalDeductions + totals.totalLoans).toLocaleString()}</span>
                </div>
                <div className="summary-card net">
                    <h3>Net Salary</h3>
                    <span className="amount">₹{totals.netSalary.toLocaleString()}</span>
                </div>
            </div>

            {/* Salary Components */}
            <div className="salary-components">
                {/* Allowances */}
                <div className="component-section">
                    <div className="section-header">
                        <h3><TrendingUp size={18} /> Allowances</h3>
                        <button className="btn btn-sm btn-primary" onClick={() => openModal('allowance')}>
                            <Plus size={14} /> Add
                        </button>
                    </div>
                    <table className="data-table compact">
                        <thead>
                            <tr><th>Type</th><th>Title</th><th>Amount</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {(salaryData.allowances || []).length === 0 ? (
                                <tr><td colSpan={4} className="empty-row">No allowances</td></tr>
                            ) : (
                                (salaryData.allowances || []).map(item => (
                                    <tr key={item.id}>
                                        <td>{item.allowance_option?.name || item.type || '-'}</td>
                                        <td>{item.title || '-'}</td>
                                        <td className="text-success">+₹{parseFloat(item.amount || 0).toLocaleString()}</td>
                                        <td>
                                            <button className="btn btn-sm" onClick={() => openModal('allowance', item)}><Edit size={12} /></button>
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete('allowance', item.id)}><Trash2 size={12} /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Commissions */}
                <div className="component-section">
                    <div className="section-header">
                        <h3><Percent size={18} /> Commissions</h3>
                        <button className="btn btn-sm btn-primary" onClick={() => openModal('commission')}>
                            <Plus size={14} /> Add
                        </button>
                    </div>
                    <table className="data-table compact">
                        <thead>
                            <tr><th>Title</th><th>Amount</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {(salaryData.commissions || []).length === 0 ? (
                                <tr><td colSpan={3} className="empty-row">No commissions</td></tr>
                            ) : (
                                (salaryData.commissions || []).map(item => (
                                    <tr key={item.id}>
                                        <td>{item.title || '-'}</td>
                                        <td className="text-success">+₹{parseFloat(item.amount || 0).toLocaleString()}</td>
                                        <td>
                                            <button className="btn btn-sm" onClick={() => openModal('commission', item)}><Edit size={12} /></button>
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete('commission', item.id)}><Trash2 size={12} /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Loans */}
                <div className="component-section">
                    <div className="section-header">
                        <h3><Calculator size={18} /> Loans</h3>
                        <button className="btn btn-sm btn-primary" onClick={() => openModal('loan')}>
                            <Plus size={14} /> Add
                        </button>
                    </div>
                    <table className="data-table compact">
                        <thead>
                            <tr><th>Type</th><th>Title</th><th>Amount</th><th>Monthly</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {(salaryData.loans || []).length === 0 ? (
                                <tr><td colSpan={5} className="empty-row">No loans</td></tr>
                            ) : (
                                (salaryData.loans || []).map(item => (
                                    <tr key={item.id}>
                                        <td>{item.loan_option?.name || item.type || '-'}</td>
                                        <td>{item.title || '-'}</td>
                                        <td>₹{parseFloat(item.amount || 0).toLocaleString()}</td>
                                        <td className="text-danger">-₹{parseFloat(item.monthly_payment || 0).toLocaleString()}</td>
                                        <td>
                                            <button className="btn btn-sm" onClick={() => openModal('loan', item)}><Edit size={12} /></button>
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete('loan', item.id)}><Trash2 size={12} /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Deductions */}
                <div className="component-section">
                    <div className="section-header">
                        <h3><TrendingDown size={18} /> Deductions</h3>
                        <button className="btn btn-sm btn-primary" onClick={() => openModal('deduction')}>
                            <Plus size={14} /> Add
                        </button>
                    </div>
                    <table className="data-table compact">
                        <thead>
                            <tr><th>Type</th><th>Title</th><th>Amount</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {(salaryData.deductions || []).length === 0 ? (
                                <tr><td colSpan={4} className="empty-row">No deductions</td></tr>
                            ) : (
                                (salaryData.deductions || []).map(item => (
                                    <tr key={item.id}>
                                        <td>{item.deduction_option?.name || item.type || '-'}</td>
                                        <td>{item.title || '-'}</td>
                                        <td className="text-danger">-₹{parseFloat(item.amount || 0).toLocaleString()}</td>
                                        <td>
                                            <button className="btn btn-sm" onClick={() => openModal('deduction', item)}><Edit size={12} /></button>
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete('deduction', item.id)}><Trash2 size={12} /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Overtime */}
                <div className="component-section">
                    <div className="section-header">
                        <h3><DollarSign size={18} /> Overtime</h3>
                        <button className="btn btn-sm btn-primary" onClick={() => openModal('overtime')}>
                            <Plus size={14} /> Add
                        </button>
                    </div>
                    <table className="data-table compact">
                        <thead>
                            <tr><th>Title</th><th>Hours</th><th>Rate</th><th>Amount</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {(salaryData.overtime || []).length === 0 ? (
                                <tr><td colSpan={5} className="empty-row">No overtime</td></tr>
                            ) : (
                                (salaryData.overtime || []).map(item => (
                                    <tr key={item.id}>
                                        <td>{item.title || '-'}</td>
                                        <td>{item.hours || 0}</td>
                                        <td>₹{parseFloat(item.rate || 0).toLocaleString()}/hr</td>
                                        <td className="text-success">+₹{parseFloat(item.amount || 0).toLocaleString()}</td>
                                        <td>
                                            <button className="btn btn-sm" onClick={() => openModal('overtime', item)}><Edit size={12} /></button>
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete('overtime', item.id)}><Trash2 size={12} /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for Adding/Editing Components */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={`${formData.id ? 'Edit' : 'Add'} ${modalType}`}>
                <form onSubmit={handleSubmit}>
                    {(modalType === 'allowance') && (
                        <div className="form-group">
                            <label>Allowance Type</label>
                            <select value={formData.allowance_option_id || ''} onChange={(e) => setFormData({ ...formData, allowance_option_id: e.target.value })}>
                                <option value="">Select Type</option>
                                {options.allowanceOptions.map(opt => (
                                    <option key={opt.id} value={opt.id}>{opt.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    {(modalType === 'loan') && (
                        <div className="form-group">
                            <label>Loan Type</label>
                            <select value={formData.loan_option_id || ''} onChange={(e) => setFormData({ ...formData, loan_option_id: e.target.value })}>
                                <option value="">Select Type</option>
                                {options.loanOptions.map(opt => (
                                    <option key={opt.id} value={opt.id}>{opt.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    {(modalType === 'deduction') && (
                        <div className="form-group">
                            <label>Deduction Type</label>
                            <select value={formData.deduction_option_id || ''} onChange={(e) => setFormData({ ...formData, deduction_option_id: e.target.value })}>
                                <option value="">Select Type</option>
                                {options.deductionOptions.map(opt => (
                                    <option key={opt.id} value={opt.id}>{opt.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div className="form-group">
                        <label>Title</label>
                        <input type="text" value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                    </div>
                    {modalType === 'overtime' && (
                        <>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Hours</label>
                                    <input type="number" value={formData.hours || ''} onChange={(e) => setFormData({ ...formData, hours: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Rate per Hour</label>
                                    <input type="number" value={formData.rate || ''} onChange={(e) => setFormData({ ...formData, rate: e.target.value })} />
                                </div>
                            </div>
                        </>
                    )}
                    {modalType === 'loan' && (
                        <div className="form-group">
                            <label>Monthly Payment</label>
                            <input type="number" value={formData.monthly_payment || ''} onChange={(e) => setFormData({ ...formData, monthly_payment: e.target.value })} />
                        </div>
                    )}
                    <div className="form-group">
                        <label>Amount</label>
                        <input type="number" value={formData.amount || ''} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
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
