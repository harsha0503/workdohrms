import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/authService';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StaffMembers from './pages/StaffMembers';
import StaffForm from './pages/StaffForm';
import EmployeeProfile from './pages/EmployeeProfile';
import Attendance from './pages/Attendance';
import LeaveRequests from './pages/LeaveRequests';
import Payroll from './pages/Payroll';
import Events from './pages/Events';
import Reports from './pages/Reports';
import Organization from './pages/Organization';
import Recruitment from './pages/Recruitment';
import Training from './pages/Training';
import Assets from './pages/Assets';
import Meetings from './pages/Meetings';
import Contracts from './pages/Contracts';
import Documents from './pages/Documents';
import Timesheets from './pages/Timesheets';
import Onboarding from './pages/Onboarding';
import HRAdmin from './pages/HRAdmin';
import CompanyPolicy from './pages/CompanyPolicy';
import Settings from './pages/Settings';
import Performance from './pages/Performance';
import Calendar from './pages/Calendar';
import MediaLibrary from './pages/MediaLibrary';
import PayrollSetup from './pages/PayrollSetup';
import UsersRoles from './pages/UsersRoles';
import LeaveTypes from './pages/LeaveTypes';
import SetSalary from './pages/SetSalary';
import Projects from './pages/Projects';
import Holidays from './pages/Holidays';
import OrganizationChart from './pages/OrganizationChart';
import Announcements from './pages/Announcements';
import ActivityLog from './pages/ActivityLog';
import Shifts from './pages/Shifts';

function PrivateRoute({ children }) {
  return authService.isAuthenticated() ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route index element={<Dashboard />} />

          {/* Staff Management */}
          <Route path="users" element={<UsersRoles />} />
          <Route path="activity-log" element={<ActivityLog />} />

          {/* HR Management */}
          <Route path="staff" element={<StaffMembers />} />
          <Route path="staff/new" element={<StaffForm />} />
          <Route path="staff/:id" element={<EmployeeProfile />} />
          <Route path="staff/:id/edit" element={<StaffForm />} />
          <Route path="staff/:id/salary" element={<SetSalary />} />
          <Route path="organization" element={<Organization />} />
          <Route path="organization-chart" element={<OrganizationChart />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="shifts" element={<Shifts />} />
          <Route path="leave" element={<LeaveRequests />} />
          <Route path="assets" element={<Assets />} />
          <Route path="training" element={<Training />} />
          <Route path="events" element={<Events />} />
          <Route path="performance" element={<Performance />} />

          {/* HR Admin */}
          <Route path="hr-admin" element={<HRAdmin />} />
          <Route path="company-policy" element={<CompanyPolicy />} />
          <Route path="holidays" element={<Holidays />} />
          <Route path="announcements" element={<Announcements />} />

          {/* Recruitment */}
          <Route path="recruitment" element={<Recruitment />} />
          <Route path="onboarding" element={<Onboarding />} />

          {/* Contracts */}
          <Route path="contracts" element={<Contracts />} />

          {/* Documents */}
          <Route path="documents" element={<Documents />} />

          {/* Meetings */}
          <Route path="meetings" element={<Meetings />} />

          {/* Calendar */}
          <Route path="calendar" element={<Calendar />} />

          {/* Media Library */}
          <Route path="media" element={<MediaLibrary />} />

          {/* Time Tracking / Projects */}
          <Route path="timesheets" element={<Timesheets />} />
          <Route path="projects" element={<Projects />} />

          {/* Payroll */}
          <Route path="payroll" element={<Payroll />} />
          <Route path="payroll-setup" element={<PayrollSetup />} />

          {/* Configuration */}
          <Route path="configuration" element={<LeaveTypes />} />

          {/* Reports */}
          <Route path="reports" element={<Reports />} />

          {/* Settings */}
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
