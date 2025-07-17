import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
const { user, logout } = useContext(AuthContext);
const nav = useNavigate();

const goHome = () => {
if (!user) {
// Not logged in → login page
nav('/');
} else if (user.role === 'admin') {
// Admin → admin dashboard
nav('/admin');
} else {
// Worker → worker dashboard
nav('/dashboard');
}
};

return (
<nav className="navbar navbar-dark bg-dark px-3">
<span
className="navbar-brand mb-0 h1"
style={{ cursor: 'pointer' }}
onClick={goHome}
>
Timesheet App
</span>
{user && (
<button className="btn btn-outline-light" onClick={logout}>
Logout
</button>
)}
</nav>
);
}
