import api from './api';

export const salaryService = {
    // Employee Salary
    getEmployeeSalary: (employeeId) => api.get(`/staff-members/${employeeId}/salary`),
    setBasicSalary: (employeeId, data) => api.post(`/staff-members/${employeeId}/salary`, data),
    updateBasicSalary: (employeeId, data) => api.put(`/staff-members/${employeeId}/salary`, data),

    // Allowances
    getEmployeeAllowances: (employeeId) => api.get(`/staff-members/${employeeId}/allowances`),
    addAllowance: (employeeId, data) => api.post(`/staff-members/${employeeId}/allowances`, data),
    updateAllowance: (employeeId, allowanceId, data) => api.put(`/staff-members/${employeeId}/allowances/${allowanceId}`, data),
    deleteAllowance: (employeeId, allowanceId) => api.delete(`/staff-members/${employeeId}/allowances/${allowanceId}`),

    // Commissions
    getEmployeeCommissions: (employeeId) => api.get(`/staff-members/${employeeId}/commissions`),
    addCommission: (employeeId, data) => api.post(`/staff-members/${employeeId}/commissions`, data),
    updateCommission: (employeeId, commissionId, data) => api.put(`/staff-members/${employeeId}/commissions/${commissionId}`, data),
    deleteCommission: (employeeId, commissionId) => api.delete(`/staff-members/${employeeId}/commissions/${commissionId}`),

    // Loans
    getEmployeeLoans: (employeeId) => api.get(`/staff-members/${employeeId}/loans`),
    addLoan: (employeeId, data) => api.post(`/staff-members/${employeeId}/loans`, data),
    updateLoan: (employeeId, loanId, data) => api.put(`/staff-members/${employeeId}/loans/${loanId}`, data),
    deleteLoan: (employeeId, loanId) => api.delete(`/staff-members/${employeeId}/loans/${loanId}`),

    // Deductions
    getEmployeeDeductions: (employeeId) => api.get(`/staff-members/${employeeId}/deductions`),
    addDeduction: (employeeId, data) => api.post(`/staff-members/${employeeId}/deductions`, data),
    updateDeduction: (employeeId, deductionId, data) => api.put(`/staff-members/${employeeId}/deductions/${deductionId}`, data),
    deleteDeduction: (employeeId, deductionId) => api.delete(`/staff-members/${employeeId}/deductions/${deductionId}`),

    // Overtime
    getEmployeeOvertime: (employeeId) => api.get(`/staff-members/${employeeId}/overtime`),
    addOvertime: (employeeId, data) => api.post(`/staff-members/${employeeId}/overtime`, data),
    updateOvertime: (employeeId, overtimeId, data) => api.put(`/staff-members/${employeeId}/overtime/${overtimeId}`, data),
    deleteOvertime: (employeeId, overtimeId) => api.delete(`/staff-members/${employeeId}/overtime/${overtimeId}`),

    // Other Payments
    getEmployeeOtherPayments: (employeeId) => api.get(`/staff-members/${employeeId}/other-payments`),
    addOtherPayment: (employeeId, data) => api.post(`/staff-members/${employeeId}/other-payments`, data),
    updateOtherPayment: (employeeId, paymentId, data) => api.put(`/staff-members/${employeeId}/other-payments/${paymentId}`, data),
    deleteOtherPayment: (employeeId, paymentId) => api.delete(`/staff-members/${employeeId}/other-payments/${paymentId}`),

    // Company Contributions
    getEmployeeContributions: (employeeId) => api.get(`/staff-members/${employeeId}/contributions`),
    addContribution: (employeeId, data) => api.post(`/staff-members/${employeeId}/contributions`, data),
    updateContribution: (employeeId, contributionId, data) => api.put(`/staff-members/${employeeId}/contributions/${contributionId}`, data),
    deleteContribution: (employeeId, contributionId) => api.delete(`/staff-members/${employeeId}/contributions/${contributionId}`),

    // Payslip
    generatePayslip: (employeeId, month, year) => api.post(`/staff-members/${employeeId}/payslip`, { month, year }),
    getPayslip: (employeeId, payslipId) => api.get(`/staff-members/${employeeId}/payslips/${payslipId}`),
    getPayslips: (employeeId, params = {}) => api.get(`/staff-members/${employeeId}/payslips`, { params }),
    deletePayslip: (employeeId, payslipId) => api.delete(`/staff-members/${employeeId}/payslips/${payslipId}`),
    downloadPayslipPDF: (employeeId, payslipId) => api.get(`/staff-members/${employeeId}/payslips/${payslipId}/pdf`, {
        responseType: 'blob'
    }),
    emailPayslip: (employeeId, payslipId) => api.post(`/staff-members/${employeeId}/payslips/${payslipId}/email`),

    // Pay Run (bulk payslip generation)
    runPayroll: (month, year, employeeIds = []) => api.post('/payroll/run', { month, year, employee_ids: employeeIds }),
    getPayrollRuns: (params = {}) => api.get('/payroll/runs', { params }),
    getPayrollRunDetails: (runId) => api.get(`/payroll/runs/${runId}`),

    // Salary Components Options
    getAllowanceOptions: () => api.get('/payroll/allowance-options'),
    createAllowanceOption: (data) => api.post('/payroll/allowance-options', data),
    updateAllowanceOption: (id, data) => api.put(`/payroll/allowance-options/${id}`, data),
    deleteAllowanceOption: (id) => api.delete(`/payroll/allowance-options/${id}`),

    getDeductionOptions: () => api.get('/payroll/deduction-options'),
    createDeductionOption: (data) => api.post('/payroll/deduction-options', data),
    updateDeductionOption: (id, data) => api.put(`/payroll/deduction-options/${id}`, data),
    deleteDeductionOption: (id) => api.delete(`/payroll/deduction-options/${id}`),

    getLoanOptions: () => api.get('/payroll/loan-options'),
    createLoanOption: (data) => api.post('/payroll/loan-options', data),
    updateLoanOption: (id, data) => api.put(`/payroll/loan-options/${id}`, data),
    deleteLoanOption: (id) => api.delete(`/payroll/loan-options/${id}`),

    // Tax Settings
    getTaxBrackets: () => api.get('/payroll/tax-brackets'),
    createTaxBracket: (data) => api.post('/payroll/tax-brackets', data),
    updateTaxBracket: (id, data) => api.put(`/payroll/tax-brackets/${id}`, data),
    deleteTaxBracket: (id) => api.delete(`/payroll/tax-brackets/${id}`),

    // Payslip Types
    getPayslipTypes: () => api.get('/payroll/payslip-types'),
    createPayslipType: (data) => api.post('/payroll/payslip-types', data),
    updatePayslipType: (id, data) => api.put(`/payroll/payslip-types/${id}`, data),
    deletePayslipType: (id) => api.delete(`/payroll/payslip-types/${id}`),
};
