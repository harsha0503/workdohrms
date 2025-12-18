import api from './api';

export const documentGeneratorService = {
    // Employee Documents
    generateJoiningLetter: (employeeId) => api.get(`/staff-members/${employeeId}/documents/joining-letter`, {
        responseType: 'blob'
    }),
    generateExperienceCertificate: (employeeId) => api.get(`/staff-members/${employeeId}/documents/experience-certificate`, {
        responseType: 'blob'
    }),
    generateNOC: (employeeId) => api.get(`/staff-members/${employeeId}/documents/noc`, {
        responseType: 'blob'
    }),
    generateIDCard: (employeeId) => api.get(`/staff-members/${employeeId}/documents/id-card`, {
        responseType: 'blob'
    }),
    generateSalarySlip: (employeeId, month, year) => api.get(`/staff-members/${employeeId}/documents/salary-slip`, {
        params: { month, year },
        responseType: 'blob'
    }),

    // Offer Letter
    generateOfferLetter: (candidateId, data) => api.post(`/candidates/${candidateId}/offer-letter`, data, {
        responseType: 'blob'
    }),

    // Contract PDF
    generateContractPDF: (contractId) => api.get(`/contracts/${contractId}/pdf`, {
        responseType: 'blob'
    }),

    // Training Certificate
    generateTrainingCertificate: (employeeId, trainingId) => api.get(`/staff-members/${employeeId}/trainings/${trainingId}/certificate`, {
        responseType: 'blob'
    }),

    // Payslip PDF
    generatePayslipPDF: (payslipId) => api.get(`/payslips/${payslipId}/pdf`, {
        responseType: 'blob'
    }),

    // Bulk Payslip PDF
    generateBulkPayslipPDF: (month, year) => api.get('/payslips/bulk-pdf', {
        params: { month, year },
        responseType: 'blob'
    }),

    // Appraisal Report
    generateAppraisalReport: (appraisalId) => api.get(`/appraisals/${appraisalId}/report`, {
        responseType: 'blob'
    }),

    // Helper to download blob
    downloadBlob: (blob, filename) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    }
};
