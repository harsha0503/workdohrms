import api from './api';

export const payrollService = {
    // Salary Slips
    getSalarySlips: (params) => api.get('/salary-slips', { params }),
    getSalarySlipById: (id) => api.get(`/salary-slips/${id}`),
    generatePayslip: (data) => api.post('/salary-slips/generate', data),
    bulkGeneratePayslips: (period) => api.post('/salary-slips/bulk-generate', { salary_period: period }),
    markAsPaid: (id) => api.post(`/salary-slips/${id}/mark-paid`),

    // Benefits
    getBenefits: (params) => api.get('/staff-benefits', { params }),
    createBenefit: (data) => api.post('/staff-benefits', data),
    updateBenefit: (id, data) => api.put(`/staff-benefits/${id}`, data),
    deleteBenefit: (id) => api.delete(`/staff-benefits/${id}`),

    // Deductions
    getDeductions: (params) => api.get('/recurring-deductions', { params }),
    createDeduction: (data) => api.post('/recurring-deductions', data),
    updateDeduction: (id, data) => api.put(`/recurring-deductions/${id}`, data),
    deleteDeduction: (id) => api.delete(`/recurring-deductions/${id}`),

    // Tax
    getTaxSlabs: () => api.get('/tax-slabs'),
    calculateTax: (income) => api.post('/tax-slabs/calculate', { income })
};
