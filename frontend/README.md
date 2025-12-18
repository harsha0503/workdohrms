# HRMS Frontend

Modern React-based frontend for the HRMS API.

## Tech Stack

- **React** 18 with Vite
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icons
- **CSS Modules** - Component styling

## Design

Clean, modern UI matching the reference design with:

- Sidebar navigation
- Dashboard with stats cards
- Data tables with pagination
- Form management
- Responsive design

## Features Implemented

### 1. Organization Setup (Prompt 1)

- ✅ Office Locations management
- ✅ Divisions by location
- ✅ Job Titles by division

### 2. Staff Management (Prompt 2)

- ✅ Staff listing with search
- ✅ Add/Edit/Delete staff
- ✅ CSV export
- ✅ Pagination

### 3. Attendance (Prompt 3)

- ✅ Clock In/Out functionality
- ✅ Attendance summary
- ✅ Work logs management

### 4. Leave Management (Prompt 4)

- ✅ Leave requests listing
- ✅ Approve/Decline requests
- ✅ Filter by status
- ✅ Leave balance tracking

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Environment

API Base URL is set to `http://localhost:8000/api`

To change, update `src/services/api.js`:

```javascript
baseURL: 'http://your-api-url/api'
```

## Default Credentials

- **Email**: <admin@hrms.local>
- **Password**: password

## Project Structure

```
src/
├── components/
│   ├── Layout.jsx          # Main layout with sidebar
│   └── Layout.css
│
├── pages/
│   ├── Login.jsx           # Login page
│   ├── Dashboard.jsx       # Dashboard with stats
│   ├── StaffMembers.jsx    # Staff management
│   ├── Attendance.jsx      # Clock in/out
│   ├── LeaveRequests.jsx   # Leave management
│   └── Organization.jsx    # Org structure
│
├── services/
│   ├── api.js              # Axios config
│   ├── authService.js      # Auth methods
│   ├── staffService.js     # Staff APIs
│   ├── attendanceService.js
│   ├── leaveService.js
│   └── organizationService.js
│
├── App.jsx                 # Routes
├── main.jsx               # Entry point
└── index.css              # Global styles
```

## Available Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Dashboard | Overview & stats |
| `/staff` | StaffMembers | Staff list |
| `/attendance` | Attendance | Clock in/out |
| `/leave` | LeaveRequests | Leave management |
| `/organization` | Organization | Org structure |

## Color Scheme

| Color | Value | Usage |
|-------|-------|-------|
| Primary | `#6366f1` | Buttons, links |
| Success | `#10b981` | Success states |
| Warning | `#f59e0b` | Warnings |
| Error | `#ef4444` | Errors |

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

---

*Built with React + Vite*
