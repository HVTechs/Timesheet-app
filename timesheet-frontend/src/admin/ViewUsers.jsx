import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Table, Spinner, Alert, Button } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import BackHomeButtons from '../components/BackHomeButtons';

export default function ViewUsers() {
const { user, logout } = useContext(AuthContext);
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const [success, setSuccess] = useState('');

// Load all users
const loadUsers = async () => {
setLoading(true);
try {
const { data } = await axios.get(
'http://localhost:5000/api/admin/users',
{ headers: { Authorization: `Bearer ${user.token}` } }
);
setUsers(data);
setError('');
} catch {
setError('Failed to load users');
} finally {
setLoading(false);
}
};

useEffect(() => {
loadUsers();
}, [user]);

// Delete a user
const handleDelete = async (id) => {
if (!window.confirm('Delete this user?')) return;

try {
await axios.delete(
`http://localhost:5000/api/admin/users/${id}`,
{ headers: { Authorization: `Bearer ${user.token}` } }
);
setSuccess('User deleted successfully');
loadUsers();
} catch {
setError('Failed to delete user');
}
};

// Reset a user's password
const handleReset = async (id) => {
const newPassword = window.prompt('Enter new password (min 6 chars):');
if (!newPassword) return;

try {
await axios.put(
`http://localhost:5000/api/admin/users/${id}/reset-password`,
{ newPassword },
{ headers: { Authorization: `Bearer ${user.token}` } }
);
setSuccess('Password reset successfully');
} catch {
setError('Failed to reset password');
}
};

if (loading) return <Spinner animation="border" />;

return (
<div>
{/* Header with Back/Home and Logout */}
<div className="d-flex justify-content-between align-items-center mb-3">
<BackHomeButtons />
<button className="btn btn-outline-danger btn-sm" onClick={logout}>
Logout
</button>
</div>

<h3 className="text-center">All Users</h3>

{error && <Alert variant="danger">{error}</Alert>}
{success && <Alert variant="success">{success}</Alert>}

<Table striped bordered hover>
<thead>
<tr>
<th>Name</th>
<th>Email</th>
<th>Role</th>
<th>Actions</th>
</tr>
</thead>
<tbody>
{users.map(u => (
<tr key={u._id}>
<td>{u.name}</td>
<td>{u.email}</td>
<td>{u.role}</td>
<td>
<Button
size="sm"
variant="warning"
className="me-2"
onClick={() => handleReset(u._id)}
>
Reset Password
</Button>
<Button
size="sm"
variant="outline-danger"
onClick={() => handleDelete(u._id)}
>
Delete
</Button>
</td>
</tr>
))}
</tbody>
</Table>
</div>
);
}