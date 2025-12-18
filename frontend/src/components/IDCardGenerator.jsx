import { useState, useRef } from 'react';
import { Download, Printer, User, Building, Phone, Mail, QrCode } from 'lucide-react';
import { documentGeneratorService } from '../services/documentGeneratorService';
import './IDCardGenerator.css';

export default function IDCardGenerator({ employee, onClose }) {
    const cardRef = useRef(null);
    const [generating, setGenerating] = useState(false);

    const handleDownload = async () => {
        setGenerating(true);
        try {
            const response = await documentGeneratorService.generateIDCard(employee.id);
            documentGeneratorService.downloadBlob(response.data, `id-card-${employee.employee_id || employee.id}.pdf`);
        } catch (error) {
            // Fallback: Create a canvas-based image
            alert('ID Card generation feature - Backend integration required');
        } finally {
            setGenerating(false);
        }
    };

    const handlePrint = () => {
        const printContent = cardRef.current?.innerHTML;
        const printWindow = window.open('', '', 'width=400,height=600');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Employee ID Card</title>
                    <style>
                        body { margin: 0; padding: 20px; font-family: 'Inter', sans-serif; }
                        .id-card { width: 340px; margin: 0 auto; }
                        .id-card-front, .id-card-back { 
                            border: 2px solid #e5e7eb;
                            border-radius: 12px;
                            padding: 20px;
                            background: white;
                            margin-bottom: 20px;
                        }
                        .card-header { text-align: center; margin-bottom: 20px; }
                        .company-logo { 
                            width: 60px; height: 60px; 
                            background: linear-gradient(135deg, #6366f1, #8b5cf6);
                            border-radius: 12px;
                            margin: 0 auto 10px;
                        }
                        .company-name { font-size: 18px; font-weight: 700; color: #1e293b; }
                        .photo-container { 
                            width: 100px; height: 120px;
                            background: #f1f5f9;
                            border-radius: 8px;
                            margin: 0 auto 15px;
                            display: flex; align-items: center; justify-content: center;
                            font-size: 48px; color: #6366f1; font-weight: 700;
                        }
                        .emp-name { font-size: 20px; font-weight: 700; text-align: center; }
                        .emp-id { font-size: 14px; color: #6366f1; text-align: center; }
                        .emp-designation { font-size: 14px; color: #64748b; text-align: center; margin-bottom: 15px; }
                        .info-row { display: flex; align-items: center; gap: 8px; margin: 8px 0; font-size: 13px; }
                        .validity { 
                            text-align: center; 
                            padding: 10px; 
                            background: #f1f5f9; 
                            border-radius: 8px;
                            margin-top: 15px;
                            font-size: 12px;
                        }
                    </style>
                </head>
                <body>${printContent}</body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    const validUntil = new Date();
    validUntil.setFullYear(validUntil.getFullYear() + 1);

    return (
        <div className="id-card-generator">
            <div className="id-card-preview" ref={cardRef}>
                <div className="id-card">
                    {/* Front Side */}
                    <div className="id-card-front">
                        <div className="card-header">
                            <div className="company-logo">
                                <Building size={32} color="white" />
                            </div>
                            <div className="company-name">WorkDo HRM</div>
                            <div className="company-tagline">Human Resource Management</div>
                        </div>

                        <div className="photo-container">
                            {employee.avatar ? (
                                <img src={employee.avatar} alt="" />
                            ) : (
                                employee.full_name?.charAt(0) || 'E'
                            )}
                        </div>

                        <h2 className="emp-name">{employee.full_name}</h2>
                        <div className="emp-id">ID: {employee.employee_id || `EMP${String(employee.id).padStart(4, '0')}`}</div>
                        <div className="emp-designation">{employee.designation?.name || employee.job_title?.title || 'Employee'}</div>

                        <div className="info-section">
                            <div className="info-row">
                                <Building size={14} />
                                <span>{employee.department?.name || employee.division?.title || 'Department'}</span>
                            </div>
                            <div className="info-row">
                                <Phone size={14} />
                                <span>{employee.phone || '+91-XXXXXXXXXX'}</span>
                            </div>
                        </div>

                        <div className="validity">
                            Valid Until: {validUntil.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </div>
                    </div>

                    {/* Back Side */}
                    <div className="id-card-back">
                        <div className="qr-section">
                            <div className="qr-placeholder">
                                <QrCode size={80} />
                            </div>
                            <p>Scan for verification</p>
                        </div>

                        <div className="emergency-info">
                            <h4>In Case of Emergency</h4>
                            <div className="info-row">
                                <span>Blood Group: {employee.blood_group || 'N/A'}</span>
                            </div>
                            <div className="info-row">
                                <span>Emergency Contact: {employee.emergency_contact || 'N/A'}</span>
                            </div>
                        </div>

                        <div className="id-footer">
                            <p>This card is the property of WorkDo HRM</p>
                            <p>If found, please return to the address below:</p>
                            <p className="address">Company Address, City, State - 000000</p>
                        </div>

                        <div className="signature-section">
                            <div className="signature-line"></div>
                            <span>Authorized Signature</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="id-card-actions">
                <button className="btn btn-secondary" onClick={handlePrint}>
                    <Printer size={16} /> Print
                </button>
                <button className="btn btn-primary" onClick={handleDownload} disabled={generating}>
                    <Download size={16} /> {generating ? 'Generating...' : 'Download PDF'}
                </button>
            </div>
        </div>
    );
}
