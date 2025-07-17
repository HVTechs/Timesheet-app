import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Form, Button, Alert } from 'react-bootstrap';
import BackHomeButtons from '../components/BackHomeButtons';

export default function AddUser() {
const { user } = useContext(AuthContext);
const [form, setForm] = useState({ name: '', email: '', password: '', role: 'worker' });
const [error, setError] = useState('');
const [success, setSuccess] = useState('');

const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

const submit = async e => {
e.preventDefault();
setError(''); setSuccess('');
try {
await axios.post('http://localhost:5000/api/admin/users', form, {
headers: { Authorization: `Bearer ${user.token}` }
});
setSuccess('User added');
setForm({ name:'', email:'', password:'', role:'worker' });
} catch {
setError('Failed to add user');
}
};

return (
<div>
<BackHomeButtons />
<h3>Add New User</h3>
{error && <Alert variant="danger">{error}</Alert>}
{success && <Alert variant="success">{success}</Alert>}
<Form onSubmit={submit} className="p-3 bg-white rounded">
<Form.Group className="mb-2">
<Form.Label>Name</Form.Label>
<Form.Control name="name" value={form.name} onChange={onChange} required />
</Form.Group>
<Form.Group className="mb-2">
<Form.Label>Email</Form.Label>
<Form.Control name="email" type="email" value={form.email} onChange={onChange} required />
</Form.Group>
<Form.Group className="mb-2">
<Form.Label>Password</Form.Label>
<Form.Control name="password" type="password" value={form.password} onChange={onChange} required />
</Form.Group>
<Form.Group className="mb-3">
<Form.Label>Role</Form.Label>
<Form.Select name="role" value={form.role} onChange={onChange}>
<option value="worker">Worker</option>
<option value="admin">Admin</option>
</Form.Select>
</Form.Group>
<Button type="submit">Add User</Button>
</Form>
</div>
);
}
