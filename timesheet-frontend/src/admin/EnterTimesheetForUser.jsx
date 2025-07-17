import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import BackHomeButtons from '../components/BackHomeButtons';

export default function EnterTimesheetForUser() {
const { user } = useContext(AuthContext);
const [users, setUsers] = useState([]);
const [form, setForm] = useState({ userId: '', date:'', start:'', end:'', breakMinutes:0 });
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const [success, setSuccess] = useState('');

useEffect(() => {
axios.get('http://localhost:5000/api/admin/users', {
headers: { Authorization: `Bearer ${user.token}` }
})
.then(res => setUsers(res.data))
.catch(() => setError('Failed to load users'))
.finally(() => setLoading(false));
}, [user]);

const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

const onSubmit = async e => {
e.preventDefault();
setError(''); setSuccess('');
try {
await axios.post('http://localhost:5000/api/admin/timesheets/enter', {
userId: form.userId,
startTime: `${form.date}T${form.start}`,
endTime: `${form.date}T${form.end}`,
breakMinutes: form.breakMinutes
}, {
headers: { Authorization: `Bearer ${user.token}` }
});
setSuccess('Timesheet entered');
setForm({ userId:'', date:'', start:'', end:'', breakMinutes:0 });
} catch {
setError('Submit failed');
}
};

if (loading) return <Spinner animation="border" />;
if (error) return <Alert variant="danger">{error}</Alert>;

return (
<div>
<BackHomeButtons />
<h3>Enter Timesheet for User</h3>
{success && <Alert variant="success">{success}</Alert>}
<Form onSubmit={onSubmit} className="p-3 bg-white rounded">
<Form.Group className="mb-2">
<Form.Label>Select User</Form.Label>
<Form.Select name="userId" value={form.userId} onChange={onChange} required>
<option value="">-- Choose --</option>
{users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
</Form.Select>
</Form.Group>
<Form.Group className="mb-2">
<Form.Label>Date</Form.Label>
<Form.Control type="date" name="date" value={form.date} onChange={onChange} required />
</Form.Group>
<Form.Group className="mb-2">
<Form.Label>Start Time</Form.Label>
<Form.Control type="time" name="start" value={form.start} onChange={onChange} required />
</Form.Group>
<Form.Group className="mb-2">
<Form.Label>End Time</Form.Label>
<Form.Control type="time" name="end" value={form.end} onChange={onChange} required />
</Form.Group>
<Form.Group className="mb-3">
<Form.Label>Break Minutes</Form.Label>
<Form.Control type="number" name="breakMinutes" min="0" value={form.breakMinutes} onChange={onChange} />
</Form.Group>
<Button type="submit">Enter Timesheet</Button>
</Form>
</div>
);
}