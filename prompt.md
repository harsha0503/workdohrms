# HRMS Backend Feature Prompts (Laravel)

> **Tech Stack:** Laravel 11 + PHP 8.2 + MySQL + Sanctum + Laratrust
>
> **Reference:** Based on demo project analysis (packages/workdo/Hrm)
>
> **Pattern:** Create original code, take reference but DON'T copy directly

---

## Prompt Set 1: Project Setup & Authentication

### Features: Laravel Installation, Sanctum Auth, Laratrust Setup, Login Flow

```
Set up Laravel 11 HRMS backend project with authentication.

**Feature 1: Laravel Project Setup**
- Install Laravel 11: laravel new workdohrms
- Configure MySQL database in .env
- Install dependencies: Sanctum, Laratrust
- Configure app timezone and locale

**Feature 2: Sanctum Authentication**
- php artisan install:api (Sanctum)
- Configure User model with HasApiTokens
- Create AuthController with login, register, logout
- Password hashing with bcrypt
- API token generation

**Feature 3: Laratrust Roles/Permissions**
- php artisan laratrust:setup
- Create roles: super-admin, company-admin, hr-manager, employee
- Define permissions pattern: {module} {action}
- Create Permission seeder with 100+ permissions
- RoleSeeder with default roles

**Feature 4: Login Flow**
- Login controller: validate email/password, issue token
- Register: create user + assign role
- Forgot password: send reset link via email
- Reset password: verify token, update password
- Logout: revoke current token

Routes (routes/api.php):
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

---

## Prompt Set 2: Organization Structure

### Features: Branch, Department, Designation, DocumentType

```
Implement organization structure management for HRMS.

**Feature 1: Branch Management**
- Migration: branches (name, address, phone, email, status, workspace, created_by)
- Model: Branch with fillable, relationships
- BranchController: index, create, store, edit, update, destroy
- Resource route: Route::resource('branch', BranchController::class)
- Blade views: index, create, edit

**Feature 2: Department Management**
- Migration: departments (name, branch_id, description, status, workspace, created_by)
- Model: Department belongsTo Branch
- DepartmentController with standard CRUD
- getDepartment endpoint for AJAX filtering by branch

**Feature 3: Designation Management**
- Migration: designations (name, department_id, description, status, workspace, created_by)
- Model: Designation belongsTo Department
- DesignationController with CRUD
- getDesignation endpoint for AJAX filtering

**Feature 4: Document Types**
- Migration: document_types (name, description, is_required, status)
- Model: DocumentType
- DocumentTypeController with CRUD
- Used when uploading employee documents
```

---

## Prompt Set 3: Employee Management

### Features: Employee CRUD, Personal Info, Employment Details, Employee Documents

```
Implement comprehensive Employee management module.

**Feature 1: Employee Model (Complex - 40+ fields)**
- Migration with fields from demo:
  - user_id, name, email, phone, dob, gender, address
  - passport_country, passport, country, state, city, zipcode
  - employee_id, biometric_emp_id
  - branch_id, department_id, designation_id, company_doj
  - account_holder_name, account_number, bank_name, branch_location
  - salary_type, salary, is_active, workspace, created_by
- Model relationships: belongsTo User, Branch, Department, Designation

**Feature 2: EmployeeController**
- index: list with DataTables, filters (branch, department)
- create: form with branch/department/designation dropdowns
- store: validate, create User + Employee, assign role
- show: full employee profile view
- edit/update: update employee details
- destroy: soft delete or deactivate
- grid: grid view alternative to table

**Feature 3: Employee Documents**
- Migration: employee_documents (employee_id, document_type_id, document_path)
- Upload documents during employee creation
- View/download documents on employee profile
- Delete documents

**Feature 4: AJAX Helpers**
- getDepartment: POST, filter departments by branch_id
- getDesignation: POST, filter designations by department_id
- Used in employee create/edit forms for cascading dropdowns
```

---

## Prompt Set 4: Employee Lifecycle - Awards & Promotions

### Features: Award Types, Awards, Promotions, Transfers

```
Implement employee recognition and career progression.

**Feature 1: Award Types**
- Migration: award_types (name, description, status, workspace, created_by)
- Model: AwardType
- AwardTypeController with CRUD
- Examples: Employee of Month, Best Performer, Innovation Award

**Feature 2: Awards**
- Migration: awards (employee_id, award_type_id, date, gift, description, workspace, created_by)
- Model: Award belongsTo Employee, AwardType
- AwardController with CRUD
- Award history per employee

**Feature 3: Promotions**
- Migration: promotions (employee_id, designation_id, promotion_title, promotion_date, description, workspace, created_by)
- Model: Promotion belongsTo Employee, Designation
- PromotionController with CRUD
- Update employee designation on promotion

**Feature 4: Transfers**
- Migration: transfers (employee_id, branch_id, department_id, transfer_date, description, workspace, created_by)
- Model: Transfer belongsTo Employee, Branch, Department
- TransferController with CRUD
- Update employee branch/department on transfer
```

---

## Prompt Set 5: Employee Lifecycle - Warnings & Terminations

### Features: Warnings, Termination Types, Terminations, Resignations

```
Implement disciplinary actions and employee exits.

**Feature 1: Warnings**
- Migration: warnings (employee_id, warning_to_user_id, subject, warning_date, description, workspace, created_by)
- Model: Warning belongsTo Employee
- WarningController with CRUD
- Warning history tracking

**Feature 2: Termination Types**
- Migration: termination_types (name, description, status)
- Model: TerminationType
- TerminationTypeController with CRUD
- Examples: Voluntary, Involuntary, Retirement

**Feature 3: Terminations**
- Migration: terminations (employee_id, termination_type_id, termination_date, notice_date, description, workspace, created_by)
- Model: Termination belongsTo Employee, TerminationType
- TerminationController with CRUD
- Update employee status on termination

**Feature 4: Resignations**
- Migration: resignations (employee_id, notice_date, resignation_date, reason, status, workspace, created_by)
- Model: Resignation belongsTo Employee
- Status: Pending, Approved, Rejected
- ResignationController with CRUD and approval workflow
```

---

## Prompt Set 6: Employee Lifecycle - Travels & Complaints

### Features: Travels (Trips), Complaints, Announcements, Holidays

```
Implement business travel and grievance management.

**Feature 1: Travels (Trips)**
- Migration: travels (employee_id, start_date, end_date, purpose, place, description, status, workspace, created_by)
- Model: Travel belongsTo Employee
- Status: Pending, Approved, Rejected
- TravelController with CRUD and approval

**Feature 2: Complaints**
- Migration: complaints (complaint_from, complaint_against, title, complaint_date, description, workspace, created_by)
- complaint_from: employee filing
- complaint_against: employee/department
- ComplaintController with CRUD

**Feature 3: Announcements**
- Migration: announcements (title, start_date, end_date, description, workspace, created_by)
- announcement_employees pivot table for targeting
- AnnouncementController with CRUD
- getemployee endpoint for multi-select

**Feature 4: Holidays**
- Migration: holidays (name, date, description, workspace, created_by)
- HolidayController with CRUD
- Holiday calendar view
- Import holidays from file
```

---

## Prompt Set 7: Leave Management

### Features: Leave Types, Leave Applications, Leave Approvals, Leave Reports

```
Implement comprehensive leave management system.

**Feature 1: Leave Types**
- Migration: leave_types (name, days, description, workspace, created_by)
- Model: LeaveType
- LeaveTypeController with CRUD
- Examples: Casual, Sick, Annual, Maternity

**Feature 2: Leave Model**
- Migration: leaves (employee_id, user_id, leave_type_id, applied_on, start_date, end_date, total_leave_days, leave_reason, remark, status, workspace, created_by)
- Model: Leave belongsTo Employee, LeaveType
- Status: Pending, Approved, Rejected
- Auto-calculate total_leave_days

**Feature 3: LeaveController**
- index: list leaves with filters
- create/store: apply for leave
- action: show approval form
- changeaction: approve/reject with remark
- jsoncount: AJAX to get leave balance

**Feature 4: Leave Reports**
- Monthly leave summary by employee
- Leave balance tracking
- Route: report/leave
- Filter by branch, department, month
```

---

## Prompt Set 8: Attendance Management

### Features: Attendance Records, Clock In/Out, Bulk Attendance, Attendance Reports

```
Implement attendance tracking and management.

**Feature 1: Attendance Model**
- Migration: attendances (employee_id, date, status, clock_in, clock_out, late, early_leaving, overtime, total_rest, workspace, created_by)
- Model: Attendance belongsTo Employee (via User)
- Status: Present, Absent, Half Day

**Feature 2: AttendanceController**
- index: list attendance with date filters
- create/store: mark single attendance
- edit/update: modify attendance
- attendance: employee self clock-in/out

**Feature 3: Bulk Attendance**
- BulkAttendance: form to mark multiple employees
- BulkAttendanceData: process bulk submission
- Select date, show all employees, mark present/absent

**Feature 4: Attendance Import/Report**
- Import from Excel/CSV file
- fileImportExport: export attendance data
- Monthly attendance report
- Route: report/monthly/attendance
```

---

## Prompt Set 9: Payroll Setup

### Features: Payslip Types, Allowance Options, Loan Options, Deduction Options

```
Implement payroll configuration modules.

**Feature 1: Payslip Types**
- Migration: payslip_types (name, description, status, workspace, created_by)
- Model: PayslipType
- PayslipTypeController with CRUD
- Used for salary type categorization

**Feature 2: Allowance Options**
- Migration: allowance_options (name, description, status, workspace, created_by)
- Model: AllowanceOption
- AllowanceOptionController with CRUD
- Examples: HRA, Medical, Transport

**Feature 3: Loan Options**
- Migration: loan_options (name, description, status, workspace, created_by)
- Model: LoanOption
- LoanOptionController with CRUD
- Examples: Personal Loan, Advance Salary

**Feature 4: Deduction Options**
- Migration: deduction_options (name, description, status, workspace, created_by)
- Model: DeductionOption
- DeductionOptionController with CRUD
- Examples: Tax, Insurance, PF
```

---

## Prompt Set 10: Salary Components

### Features: Allowances, Commissions, Loans, Saturation Deductions

```
Implement employee-specific salary components.

**Feature 1: Allowances**
- Migration: allowances (employee_id, allowance_option_id, title, type, amount, workspace, created_by)
- type: fixed or percentage
- AllowanceController with CRUD
- Create from employee salary page

**Feature 2: Commissions**
- Migration: commissions (employee_id, title, type, amount, start_date, end_date, workspace, created_by)
- Date range for commission validity
- CommissionController with CRUD

**Feature 3: Loans**
- Migration: loans (employee_id, loan_option_id, title, type, amount, start_date, end_date, reason, workspace, created_by)
- LoanController with CRUD
- EMI deduction tracking

**Feature 4: Saturation Deductions**
- Migration: saturation_deductions (employee_id, deduction_option_id, title, type, amount, workspace, created_by)
- SaturationDeductionController with CRUD
- Recurring deductions from salary
```

---

## Prompt Set 11: Payroll Processing

### Features: Other Payments, Overtime, Company Contributions, Set Salary

```
Implement additional payroll components and salary setup.

**Feature 1: Other Payments**
- Migration: other_payments (employee_id, title, type, amount, workspace, created_by)
- OtherPaymentController with CRUD
- Bonuses, special payments

**Feature 2: Overtime**
- Migration: overtimes (employee_id, title, number_of_days, hours, rate, start_date, end_date, workspace, created_by)
- Calculate: number_of_days * hours * rate
- OvertimeController with CRUD

**Feature 3: Company Contributions**
- Migration: company_contributions (employee_id, title, type, amount, workspace, created_by)
- Employer-side contributions (PF, gratuity)
- CompanyContributionController with CRUD

**Feature 4: Set Salary (Salary Structure)**
- SetSalaryController: view employee salary structure
- employeeBasicSalary: show/edit basic salary
- employeeUpdateSalary: update salary
- Dashboard showing all salary components
```

---

## Prompt Set 12: Payslip Generation

### Features: Payslip Model, PaySlipController, Payslip PDF, Payslip Email

```
Implement payslip generation and distribution.

**Feature 1: PaySlip Model**
- Migration: pay_slips (employee_id, net_payable, basic_salary, salary_month, status, allowance, commission, loan, saturation_deduction, other_payment, overtime, company_contribution, tax_bracket, workspace, created_by)
- JSON fields store component snapshots
- Model: PaySlip belongsTo Employee

**Feature 2: PaySlipController**
- index: list payslips by month
- create: generate payslip for month
- search_json: AJAX search
- store: calculate and save payslip

**Feature 3: Payslip Calculation (Employee.php)**
- get_net_salary(): calculate net pay
  - Sum: basic + allowances + commissions + overtime + other_payment + company_contribution
  - Minus: loans + deductions
  - Apply tax bracket percentage
- Store calculated values in PaySlip

**Feature 4: Payslip PDF/Email**
- pdf: generate payslip PDF using DomPDF
- payslipPdf: download PDF
- send: email payslip to employee
- Template with company header, earnings, deductions, net pay
```

---

## Prompt Set 13: Tax Management

### Features: Tax Brackets, Tax Rebates, Tax Thresholds, Allowance Tax

```
Implement tax calculation modules.

**Feature 1: Tax Brackets**
- Migration: tax_brackets (name, from, to, fixed_amount, percentage, workspace, created_by)
- TaxBracketController with CRUD
- Apply bracket based on total earnings

**Feature 2: Tax Rebates**
- Migration: tax_rebates (name, amount, description, workspace, created_by)
- TaxRebateController with CRUD
- Reduce taxable income

**Feature 3: Tax Thresholds**
- Migration: tax_thresholds (name, threshold_amount, description, workspace, created_by)
- TaxThresholdController with CRUD
- Minimum income before tax applies

**Feature 4: Allowance Tax**
- Migration: allowance_taxes (allowance_id, tax_percentage, workspace, created_by)
- AllowanceTaxController with CRUD
- Tax on specific allowances
```

---

## Prompt Set 14: Events & Calendar

### Features: Events, Event Employees, Calendar View, Event Notifications

```
Implement events and calendar management.

**Feature 1: Events Model**
- Migration: events (title, start_date, end_date, color, description, workspace, created_by)
- Migration: event_employees (event_id, employee_id)
- Model: Event with many-to-many employees

**Feature 2: EventController**
- index: list events
- create/store: create event with employee selection
- showData: event details
- getdepartment/getemployee: AJAX for filtering

**Feature 3: Calendar View**
- FullCalendar.js integration
- Display events, holidays, leaves
- Color coding by type
- Month/Week/Day views

**Feature 4: Event Notifications**
- Notify selected employees on event creation
- Email notifications
- Dashboard widget for upcoming events
```

---

## Prompt Set 15: Company Policies & Documents

### Features: Company Policies, Documents, Document Controller, Policy Acknowledgment

```
Implement document and policy management.

**Feature 1: Company Policies**
- Migration: company_policies (name, document, description, workspace, created_by)
- CompanyPolicyController with CRUD
- File upload for policy documents
- description route for viewing

**Feature 2: Documents Model**
- Migration: documents (name, document_type_id, document, description, workspace, created_by)
- Model: Document belongsTo DocumentType
- Central document repository

**Feature 3: DocumentController**
- index: list all documents
- create/store: upload new document
- description: view document details
- download: download document file
- destroy: delete document

**Feature 4: Policy Display**
- List company policies for employees
- Mark as read/acknowledged
- Policy version tracking
```

---

## Prompt Set 16: Letter Templates

### Features: Joining Letter, Experience Certificate, NOC

```
Implement HR letter generation.

**Feature 1: Joining Letter**
- Migration: joining_letters (lang, content, created_by)
- Store template with placeholders
- JoiningLetter model
- Placeholders: {employee_name}, {designation}, {join_date}, etc.

**Feature 2: Experience Certificate**
- Migration: experience_certificates (lang, content, created_by)
- Template for employment verification
- Include: dates, designation, performance

**Feature 3: NOC (No Objection Certificate)**
- Migration: noc_certificates (lang, content, created_by)
- Template with placeholders
- Generate on request

**Feature 4: Letter Generation**
- joiningletterPdf: generate PDF with employee data
- ExpCertificatePdf: generate experience letter
- NocPdf: generate NOC
- Replace placeholders with actual employee data
```

---

## Prompt Set 17: IP Restriction & Settings

### Features: IP Restriction, Company Settings, HRM Settings, Email Config

```
Implement security and configuration modules.

**Feature 1: IP Restriction**
- Migration: ip_restricts (ip, workspace, created_by)
- IpRestrictController with CRUD
- Middleware to check IP on clock-in
- Whitelist allowed IPs

**Feature 2: Company Settings**
- employee_prefix: #EMP format
- company_start_time, company_end_time
- ip_restrict: on/off toggle
- Store in settings table

**Feature 3: HRM Module Settings**
- HrmController::setting() to save settings
- Configure: work hours, overtime rules
- Leave policy defaults
- Attendance thresholds

**Feature 4: Email Configuration**
- MAIL_MAILER, MAIL_HOST settings
- Email templates for notifications
- Test email functionality
```

---

## Prompt Set 18: Reports

### Features: Monthly Attendance Report, Leave Report, Payroll Report, Dashboard

```
Implement reporting modules.

**Feature 1: Monthly Attendance Report**
- ReportController::monthlyAttendance
- Filter by branch, department, employee
- Show: present days, absent, late, overtime
- Export to Excel

**Feature 2: Leave Report**
- ReportController::leave
- Filter by month, year, leave type
- Show: taken, pending, balance
- Employee-wise breakdown

**Feature 3: Payroll Report**
- ReportController::Payroll
- Filter by month
- Show: gross, deductions, net
- Department/branch summary

**Feature 4: Dashboard Widgets**
- Total employees count
- This month attendance summary
- Pending leave requests
- Recent announcements
- Upcoming events
```

---

## Prompt Set 19: DataTables Integration

### Features: Employee DataTable, Attendance DataTable, Leave DataTable, Payslip DataTable

```
Implement server-side DataTables for lists.

**Feature 1: Employee DataTable**
- EmployeeDataTable class
- Columns: ID, Name, Email, Branch, Department, Status
- Actions: View, Edit, Delete
- Server-side processing

**Feature 2: Attendance DataTable**
- AttendanceDataTable class
- Columns: Employee, Date, Clock In, Clock Out, Status
- Filter by date range
- Bulk actions

**Feature 3: Leave DataTable**
- LeaveDataTable class
- Columns: Employee, Type, From, To, Days, Status
- Color coding by status
- Quick approve/reject

**Feature 4: Payslip DataTable**
- PayslipDataTable class
- Columns: Employee, Month, Basic, Net, Status
- Generate/View/Download actions
- Bulk generate for month
```

---

## Prompt Set 20: Import/Export Features

### Features: Employee Import, Attendance Import, Holiday Import, Data Export

```
Implement bulk data import/export functionality.

**Feature 1: Employee Import**
- fileImportExport: show import form
- fileImport: process uploaded Excel/CSV
- Sample template download
- Validation and error reporting

**Feature 2: Attendance Import**
- attendance.import routes
- Map columns to fields
- Handle date formats
- Bulk insert with validation

**Feature 3: Holiday Import**
- holiday.import routes
- Upload holiday calendar
- Parse and insert
- Handle duplicates

**Feature 4: Data Export**
- Export to Excel using Laravel Excel
- Employee list export
- Attendance report export
- Payroll summary export
```

---

## Prompt Set 21: API Layer (for Mobile/Frontend)

### Features: API Resources, API Controllers, API Routes, API Auth

```
Implement API layer for mobile/SPA integration.

**Feature 1: API Resources**
- EmployeeResource: transform employee data
- LeaveResource, AttendanceResource
- PayslipResource
- Consistent JSON structure

**Feature 2: API Controllers**
- Separate controllers in app/Http/Controllers/Api/
- Return JSON responses
- Handle API-specific logic

**Feature 3: API Routes**
- routes/api.php structure
- Version prefix: /api/v1/
- Sanctum protected routes
- Public endpoints (job listings)

**Feature 4: API Authentication**
- Login returns token
- Token in Authorization header
- Token refresh mechanism
- Logout revokes token
```

---

## Prompt Set 22: Seeders & Testing

### Features: Database Seeders, Factory Classes, Feature Tests, Unit Tests

```
Implement seeding and testing infrastructure.

**Feature 1: Database Seeders**
- UserSeeder: admin, employees
- RolePermissionSeeder: all roles/permissions
- BranchDepartmentSeeder
- DemoDataSeeder

**Feature 2: Factory Classes**
- EmployeeFactory
- LeaveFactory, AttendanceFactory
- Use Faker for realistic data

**Feature 3: Feature Tests**
- AuthTest: login, register, logout
- EmployeeTest: CRUD operations
- LeaveTest: apply, approve, reject
- AttendanceTest: mark, bulk

**Feature 4: Unit Tests**
- Employee::get_net_salary() test
- Tax calculation tests
- Leave balance calculation
- Validation rule tests
```

---

## Usage Instructions

1. **Start with Prompt Set 1** to initialize Laravel project
2. **Progress sequentially** through each phase
3. **Reference demo code** for patterns, but write original implementations
4. **Test each module** before moving to next
5. **Use `php artisan` commands** for migrations and testing

---

## Feature Summary

| Phase | Prompt Sets | Features |
|-------|-------------|----------|
| Project Setup | 1-2 | 8 |
| Employee Management | 3-6 | 16 |
| Leave & Attendance | 7-8 | 8 |
| Payroll System | 9-13 | 20 |
| Communication | 14-16 | 12 |
| Admin & Reports | 17-18 | 8 |
| Advanced | 19-22 | 16 |

**Total: 22 Prompt Sets | 88 Features (Laravel)**
