import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import BackHomeButtons from '../components/BackHomeButtons';

export default function WorkerDashboard() {
const { user, logout } = useContext(AuthContext);

return (
<div>
{/* Back & Home, plus Logout */}
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
<Link to="/profile" className="btn btn-outline-primary me-2">
View Profile
</Link>
<Link to="/timesheets" className="btn btn-outline-success">
My Timesheets
</Link>
</div>
</div>
);
}