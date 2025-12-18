# WorkDo HRM API - Complete Backend Documentation

**Version:** 1.0  
**Base URL:** `http://localhost:8000/api`  
**Authentication:** Bearer Token (Laravel Sanctum)

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Dashboard](#2-dashboard)
3. [Organization Structure](#3-organization-structure)
4. [Staff Management](#4-staff-management)
5. [HR Lifecycle](#5-hr-lifecycle)
6. [Leave Management](#6-leave-management)
7. [Attendance & Work Logs](#7-attendance--work-logs)
8. [Payroll & Compensation](#8-payroll--compensation)
9. [Asset Management](#9-asset-management)
10. [Training Management](#10-training-management)
11. [Recruitment (ATS)](#11-recruitment-ats)
12. [Onboarding](#12-onboarding)
13. [Contract Management](#13-contract-management)
14. [Meeting Management](#14-meeting-management)
15. [Shifts Management](#15-shifts-management)
16. [Timesheets](#16-timesheets)
17. [Performance Management](#17-performance-management)
18. [Calendar & Events](#18-calendar--events)
19. [Settings & Security](#19-settings--security)

---

## 1. Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/sign-up` | POST | Register new company |
| `/auth/sign-in` | POST | Login |
| `/auth/sign-out` | POST | Logout |
| `/auth/forgot-password` | POST | Request password reset |
| `/auth/reset-password` | POST | Reset password |
| `/auth/me` | GET | Current user info |

### Sign In Request

```json
{
  "email": "admin@hrms.local",
  "password": "password"
}
```

### Sign In Response

```json
{
  "success": true,
  "message": "Signed in successfully",
  "data": {
    "user": { "id": 1, "name": "Admin", "email": "admin@hrms.local" },
    "access_token": "1|abc123...",
    "token_type": "Bearer"
  }
}
```

---

## 2. Dashboard

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/dashboard` | GET | Get dashboard statistics |

### Dashboard Response

```json
{
  "success": true,
  "data": {
    "total_employees": 150,
    "employees_on_leave": 5,
    "pending_leave_requests": 12,
    "attendance_rate": 94.5,
    "recent_activities": [...]
  }
}
```

---

## 3. Organization Structure

### Office Locations (Branches)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/office-locations` | GET | List locations |
| `/office-locations` | POST | Create location |
| `/office-locations/{id}` | GET | Get location |
| `/office-locations/{id}` | PUT | Update location |
| `/office-locations/{id}` | DELETE | Delete location |

### Divisions (Departments)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/divisions` | GET | List divisions |
| `/divisions` | POST | Create division |
| `/divisions/{id}` | GET | Get division |
| `/divisions/{id}` | PUT | Update division |
| `/divisions/{id}` | DELETE | Delete division |

### Job Titles (Designations)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/job-titles` | GET | List job titles |
| `/job-titles` | POST | Create job title |
| `/job-titles/{id}` | GET | Get job title |
| `/job-titles/{id}` | PUT | Update job title |
| `/job-titles/{id}` | DELETE | Delete job title |

---

## 4. Staff Management

### Staff Members (Employees)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/staff-members` | GET | List staff |
| `/staff-members` | POST | Create staff |
| `/staff-members/{id}` | GET | Get staff details |
| `/staff-members/{id}` | PUT | Update staff |
| `/staff-members/{id}` | DELETE | Delete staff |
| `/staff-members/{id}/files` | GET | Get documents |
| `/staff-members/{id}/files` | POST | Upload document |
| `/staff-members/{id}/benefits` | GET | Get benefits |

### Users

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/users` | GET | List users |
| `/users` | POST | Create user |
| `/users/{id}` | PUT | Update user |
| `/users/{id}` | DELETE | Delete user |
| `/users/{id}/activate` | PATCH | Activate user |
| `/users/{id}/deactivate` | PATCH | Deactivate user |

### Roles

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/roles` | GET | List roles |
| `/roles` | POST | Create role |
| `/roles/{id}` | PUT | Update role |
| `/roles/{id}` | DELETE | Delete role |
| `/role-permissions` | GET | Get permissions matrix |

---

## 5. HR Lifecycle

### Role Upgrades (Promotions)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/role-upgrades` | GET | List promotions |
| `/role-upgrades` | POST | Create promotion |
| `/role-upgrades/{id}/approve` | POST | Approve |
| `/role-upgrades/{id}/reject` | POST | Reject |

### Transfers

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/staff-transfers` | GET | List transfers |
| `/staff-transfers` | POST | Create transfer |
| `/staff-transfers/{id}/approve` | POST | Approve |
| `/staff-transfers/{id}/reject` | POST | Reject |

### Discipline Notes (Warnings)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/discipline-notes` | GET | List warnings |
| `/discipline-notes` | POST | Create warning |
| `/discipline-notes/{id}` | PUT | Update warning |
| `/discipline-notes/{id}` | DELETE | Delete warning |

### Voluntary Exit (Resignations)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/voluntary-exits` | GET | List resignations |
| `/voluntary-exits` | POST | Create resignation |
| `/voluntary-exits/{id}/approve` | POST | Approve |
| `/voluntary-exits/{id}/reject` | POST | Reject |

### Offboarding (Terminations)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/offboarding-records` | GET | List terminations |
| `/offboarding-records` | POST | Create termination |
| `/offboarding-records/{id}/complete` | POST | Complete |

### Business Trips

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/business-trips` | GET | List trips |
| `/business-trips` | POST | Create trip |
| `/business-trips/{id}/approve` | POST | Approve |
| `/business-trips/{id}/reject` | POST | Reject |
| `/business-trips/{id}/complete` | POST | Mark complete |

### Grievances (Complaints)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/grievances` | GET | List complaints |
| `/grievances` | POST | Create complaint |
| `/grievances/{id}/assign` | POST | Assign handler |
| `/grievances/{id}/resolve` | POST | Resolve |
| `/grievances/{id}/close` | POST | Close |

---

## 6. Leave Management

### Time Off Categories (Leave Types)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/time-off-categories` | GET | List leave types |
| `/time-off-categories` | POST | Create type |
| `/time-off-categories/{id}` | PUT | Update type |
| `/time-off-categories/{id}` | DELETE | Delete type |

### Time Off Allocations (Leave Balances)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/time-off-allocations` | GET | List allocations |
| `/time-off-allocations` | POST | Create allocation |
| `/time-off-allocations/{id}` | PUT | Update |
| `/staff-members/{id}/leave-balances` | GET | Employee balances |

### Time Off Requests (Leave Applications)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/time-off-requests` | GET | List requests |
| `/time-off-requests` | POST | Apply for leave |
| `/time-off-requests/{id}` | GET | Get details |
| `/time-off-requests/{id}/approve` | POST | Approve |
| `/time-off-requests/{id}/reject` | POST | Reject |
| `/staff-members/{id}/leave-requests` | GET | Employee requests |
| `/pending-leave-requests` | GET | Pending approvals |

---

## 7. Attendance & Work Logs

### Work Logs (Attendance Records)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/work-logs` | GET | List records |
| `/work-logs` | POST | Create entry |
| `/work-logs/{id}` | PUT | Update |
| `/work-logs/clock-in` | POST | Clock in |
| `/work-logs/clock-out` | POST | Clock out |
| `/work-logs/current` | GET | Current session |
| `/staff-members/{id}/attendance` | GET | Employee attendance |
| `/summary` | GET | Summary stats |
| `/daily` | GET | Daily report |

---

## 8. Payroll & Compensation

### Compensation Categories (Salary Components)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/compensation-categories` | GET | List components |
| `/compensation-categories` | POST | Create component |
| `/compensation-categories/{id}` | PUT | Update |
| `/compensation-categories/{id}` | DELETE | Delete |

### Staff Benefits (Employee Salaries)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/staff-benefits` | GET | List all |
| `/staff-benefits` | POST | Add benefit |
| `/staff-benefits/{id}` | PUT | Update |
| `/staff-members/{id}/benefits` | GET | Employee benefits |

### Salary Slips (Payslips)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/salary-slips` | GET | List payslips |
| `/salary-slips` | POST | Generate payslip |
| `/salary-slips/{id}` | GET | Get payslip |
| `/salary-slips/generate-bulk` | POST | Bulk generate |
| `/salary-slips/{id}/mark-paid` | POST | Mark as paid |
| `/salary-slips/{id}/send` | POST | Email payslip |

### Salary Advances

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/salary-advances` | GET | List advances |
| `/salary-advances` | POST | Request advance |
| `/salary-advances/{id}/approve` | POST | Approve |
| `/salary-advances/{id}/reject` | POST | Reject |
| `/salary-advances/{id}/disburse` | POST | Disburse |

### Deductions

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/deductions` | GET | List deductions |
| `/deductions` | POST | Add deduction |
| `/deductions/{id}` | PUT | Update |
| `/deductions/{id}` | DELETE | Remove |

### Bonus Payments

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/bonus-payments` | GET | List bonuses |
| `/bonus-payments` | POST | Add bonus |
| `/bonus-payments/{id}/approve` | POST | Approve |
| `/bonus-payments/{id}/pay` | POST | Mark paid |

### Tax Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/tax-slabs` | GET | List tax slabs |
| `/tax-slabs` | POST | Create slab |
| `/tax-exemptions` | GET | List exemptions |
| `/tax-exemptions` | POST | Add exemption |

---

## 9. Asset Management

### Asset Types

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/asset-types` | GET | List types |
| `/asset-types` | POST | Create type |
| `/asset-types/{id}` | PUT | Update |
| `/asset-types/{id}` | DELETE | Delete |

### Assets

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/assets` | GET | List assets |
| `/assets` | POST | Create asset |
| `/assets/{id}` | GET | Get asset |
| `/assets/{id}` | PUT | Update |
| `/assets/{id}` | DELETE | Delete |
| `/assets/{id}/assign` | POST | Assign to employee |
| `/assets/{id}/return` | POST | Return asset |
| `/assets-available` | GET | Available assets |
| `/assets/employee/{id}` | GET | Employee assets |

---

## 10. Training Management

### Training Types

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/training-types` | GET | List types |
| `/training-types` | POST | Create type |
| `/training-types/{id}` | PUT | Update |
| `/training-types/{id}` | DELETE | Delete |

### Training Programs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/training-programs` | GET | List programs |
| `/training-programs` | POST | Create program |
| `/training-programs/{id}` | GET | Get program |
| `/training-programs/{id}` | PUT | Update |
| `/training-programs/{id}` | DELETE | Delete |
| `/training-programs/active` | GET | Active programs |

### Training Sessions

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/training-sessions` | GET | List sessions |
| `/training-sessions` | POST | Create session |
| `/training-sessions/{id}` | GET | Get session |
| `/training-sessions/{id}` | PUT | Update |
| `/training-sessions/{id}` | DELETE | Delete |
| `/training-sessions/{id}/enroll` | POST | Enroll employee |
| `/training-sessions/{id}/participants` | GET | List participants |
| `/training-sessions/{id}/complete-enrollment` | POST | Mark complete |
| `/training-sessions/upcoming` | GET | Upcoming sessions |

---

## 11. Recruitment (ATS)

### Job Categories

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/job-categories` | GET | List categories |
| `/job-categories` | POST | Create |
| `/job-categories/{id}` | PUT | Update |
| `/job-categories/{id}` | DELETE | Delete |

### Job Stages (Pipeline)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/job-stages` | GET | List stages |
| `/job-stages` | POST | Create stage |
| `/job-stages/{id}` | PUT | Update |
| `/job-stages/{id}` | DELETE | Delete |
| `/job-stages/reorder` | POST | Reorder stages |

### Job Postings

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/jobs` | GET | List jobs |
| `/jobs` | POST | Create job |
| `/jobs/{id}` | GET | Get job |
| `/jobs/{id}` | PUT | Update |
| `/jobs/{id}` | DELETE | Delete |
| `/jobs/{id}/publish` | POST | Publish job |
| `/jobs/{id}/close` | POST | Close job |
| `/jobs/{id}/questions` | GET | Custom questions |
| `/jobs/{id}/questions` | POST | Add question |

### Candidates

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/candidates` | GET | List candidates |
| `/candidates` | POST | Create candidate |
| `/candidates/{id}` | GET | Get candidate |
| `/candidates/{id}` | PUT | Update |
| `/candidates/{id}` | DELETE | Delete |
| `/candidates/{id}/archive` | POST | Archive |
| `/candidates/{id}/convert` | POST | Convert to employee |

### Job Applications

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/job-applications` | GET | List applications |
| `/jobs/{id}/apply` | POST | Submit application |
| `/job-applications/{id}` | GET | Get application |
| `/job-applications/{id}/move-stage` | POST | Move to stage |
| `/job-applications/{id}/rate` | POST | Rate candidate |
| `/job-applications/{id}/notes` | POST | Add note |
| `/job-applications/{id}/shortlist` | POST | Shortlist |
| `/job-applications/{id}/reject` | POST | Reject |
| `/job-applications/{id}/hire` | POST | Hire |

### Interview Schedules

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/interview-schedules` | GET | List interviews |
| `/interview-schedules` | POST | Schedule interview |
| `/interview-schedules/{id}` | GET | Get details |
| `/interview-schedules/{id}` | PUT | Update |
| `/interview-schedules/{id}` | DELETE | Cancel |
| `/interview-schedules/{id}/feedback` | POST | Submit feedback |
| `/interview-schedules/{id}/reschedule` | POST | Reschedule |
| `/interviews/calendar` | GET | Calendar view |
| `/interviews/today` | GET | Today's interviews |

---

## 12. Onboarding

### Onboarding Templates

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/onboarding-templates` | GET | List templates |
| `/onboarding-templates` | POST | Create template |
| `/onboarding-templates/{id}` | GET | Get template |
| `/onboarding-templates/{id}` | PUT | Update |
| `/onboarding-templates/{id}` | DELETE | Delete |
| `/onboarding-templates/{id}/tasks` | POST | Add task |

### Employee Onboarding

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/employee-onboardings` | GET | List onboardings |
| `/employee-onboardings` | POST | Assign onboarding |
| `/employee-onboardings/{id}` | GET | Get details & progress |
| `/employee-onboardings/{id}/complete-task` | POST | Complete task |
| `/onboardings/pending` | GET | Pending onboardings |

---

## 13. Contract Management

### Contract Types

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/contract-types` | GET | List types |
| `/contract-types` | POST | Create type |
| `/contract-types/{id}` | PUT | Update |
| `/contract-types/{id}` | DELETE | Delete |

### Contracts

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/contracts` | GET | List contracts |
| `/contracts` | POST | Create contract |
| `/contracts/{id}` | GET | Get contract |
| `/contracts/{id}` | PUT | Update |
| `/contracts/{id}` | DELETE | Delete |
| `/contracts/{id}/renew` | POST | Renew contract |
| `/contracts/{id}/terminate` | POST | Terminate |
| `/contracts-expiring` | GET | Expiring soon |
| `/contracts/employee/{id}` | GET | Employee contracts |

---

## 14. Meeting Management

### Meeting Types

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/meeting-types` | GET | List types |
| `/meeting-types` | POST | Create type |
| `/meeting-types/{id}` | PUT | Update |
| `/meeting-types/{id}` | DELETE | Delete |

### Meeting Rooms

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/meeting-rooms` | GET | List rooms |
| `/meeting-rooms` | POST | Create room |
| `/meeting-rooms/{id}` | PUT | Update |
| `/meeting-rooms/{id}` | DELETE | Delete |
| `/meeting-rooms-available` | GET | Available rooms |

### Meetings

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/meetings` | GET | List meetings |
| `/meetings` | POST | Schedule meeting |
| `/meetings/{id}` | GET | Get meeting |
| `/meetings/{id}` | PUT | Update |
| `/meetings/{id}` | DELETE | Cancel |
| `/meetings/{id}/attendees` | POST | Add attendees |
| `/meetings/{id}/start` | POST | Start meeting |
| `/meetings/{id}/complete` | POST | Complete meeting |
| `/meetings/{id}/minutes` | POST | Add minutes |
| `/meetings/{id}/action-items` | POST | Add action item |
| `/meeting-action-items/{id}/complete` | POST | Complete action |
| `/meetings-calendar` | GET | Calendar view |
| `/my-meetings` | GET | My meetings |

---

## 15. Shifts Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/shifts` | GET | List shifts |
| `/shifts` | POST | Create shift |
| `/shifts/{id}` | GET | Get shift |
| `/shifts/{id}` | PUT | Update |
| `/shifts/{id}` | DELETE | Delete |
| `/shifts/{id}/assign` | POST | Assign to employee |
| `/shift-roster` | GET | Roster view |
| `/shifts/employee/{id}` | GET | Employee shifts |

---

## 16. Timesheets

### Timesheet Projects

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/timesheet-projects` | GET | List projects |
| `/timesheet-projects` | POST | Create project |
| `/timesheet-projects/{id}` | GET | Get project |
| `/timesheet-projects/{id}` | PUT | Update |
| `/timesheet-projects/{id}` | DELETE | Delete |

### Timesheets

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/timesheets` | GET | List entries |
| `/timesheets` | POST | Create entry |
| `/timesheets/{id}` | GET | Get entry |
| `/timesheets/{id}` | PUT | Update |
| `/timesheets/{id}` | DELETE | Delete |
| `/timesheets/bulk` | POST | Bulk create |
| `/timesheets/{id}/submit` | POST | Submit for approval |
| `/timesheets/{id}/approve` | POST | Approve |
| `/timesheets/{id}/reject` | POST | Reject |
| `/timesheet-summary` | GET | Summary report |
| `/timesheets/employee/{id}` | GET | Employee timesheets |
| `/timesheet-report` | GET | Generate report |

---

## 17. Performance Management

### Performance Objectives

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/performance-objectives` | GET | List objectives |
| `/performance-objectives` | POST | Create objective |
| `/performance-objectives/{id}` | GET | Get objective |
| `/performance-objectives/{id}` | PUT | Update |
| `/performance-objectives/{id}` | DELETE | Delete |
| `/performance-objectives/{id}/progress` | POST | Update progress |
| `/staff-members/{id}/objectives` | GET | Employee objectives |

### Appraisal Cycles

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/appraisal-cycles` | GET | List cycles |
| `/appraisal-cycles` | POST | Create cycle |
| `/appraisal-cycles/{id}` | GET | Get cycle |
| `/appraisal-cycles/{id}` | PUT | Update |
| `/appraisal-cycles/{id}` | DELETE | Delete |
| `/appraisal-cycles/{id}/activate` | POST | Activate |
| `/appraisal-cycles/{id}/complete` | POST | Complete |

### Appraisal Records

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/appraisal-records` | GET | List records |
| `/appraisal-records` | POST | Create record |
| `/appraisal-records/{id}` | GET | Get record |
| `/appraisal-records/{id}` | PUT | Update |
| `/appraisal-records/{id}/submit` | POST | Submit |
| `/my-appraisals` | GET | My appraisals |

---

## 18. Calendar & Events

### Company Events

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/company-events` | GET | List events |
| `/company-events` | POST | Create event |
| `/company-events/{id}` | PUT | Update |
| `/company-events/{id}` | DELETE | Delete |

### Company Holidays

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/company-holidays` | GET | List holidays |
| `/company-holidays` | POST | Create holiday |
| `/company-holidays/{id}` | PUT | Update |
| `/company-holidays/{id}` | DELETE | Delete |

### Company Notices

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/company-notices` | GET | List notices |
| `/company-notices` | POST | Create notice |
| `/company-notices/{id}` | PUT | Update |
| `/company-notices/{id}` | DELETE | Delete |
| `/company-notices/active` | GET | Active notices |

### Calendar Data

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/calendar-data` | GET | Combined calendar |

---

## 19. Settings & Security

### Letter Templates

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/letter-templates` | GET | List templates |
| `/letter-templates` | POST | Create template |
| `/letter-templates/{id}` | PUT | Update |
| `/letter-templates/{id}` | DELETE | Delete |
| `/letter-templates/{id}/generate` | POST | Generate letter |

### Allowed IPs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/allowed-ips` | GET | List IPs |
| `/allowed-ips` | POST | Add IP |
| `/allowed-ips/{id}` | PUT | Update |
| `/allowed-ips/{id}` | DELETE | Remove |

---

## Standard Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation completed",
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field": ["Error message"]
  }
}
```

### Pagination

```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [...],
    "per_page": 15,
    "total": 100,
    "last_page": 7
  }
}
```

---

## Authentication Headers

All authenticated endpoints require:

```
Authorization: Bearer {token}
Accept: application/json
Content-Type: application/json
```

---

**Total Endpoints: 444**  
**Documentation Version: 1.0**  
**Last Updated: December 18, 2024**
