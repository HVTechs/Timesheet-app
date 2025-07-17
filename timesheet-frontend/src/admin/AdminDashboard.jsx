import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // your auth context
import BackHomeButtons from '../components/BackHomeButtons';

export default function AdminDashboard() {
const { logout, user } = useContext(AuthContext);

return (
<div>
{/* Header: Back/Home + Logout */}
<div className="d-flex justify-content-between align-items-center mb-3">
<BackHomeButtons />
<button
className="btn btn-outline-danger btn-sm"
onClick={logout}
>
Logout
</button>
</div>

<h2 className="text-center">Welcome, {user.name}!</h2>

<div className="text-center mt-4">
<Link to="/admin/users" className="btn btn-outline-primary me-2">
View Users
</Link>
<Link to="/admin/add-user" className="btn btn-outline-success me-2">
Add User
</Link>
<Link to="/admin/timesheets" className="btn btn-outline-secondary me-2">
Manage Timesheets
</Link>
<Link to="/admin/enter-timesheet" className="btn btn-outline-info">
Enter Timesheet
</Link>
</div>
</div>
);
}
