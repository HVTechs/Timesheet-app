import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import {
Table,
Spinner,
Alert,
Button,
Form,
Row,
Col
} from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import BackHomeButtons from '../components/BackHomeButtons';

export default function AdminTimesheetManager() {
const { user, logout } = useContext(AuthContext);
const [sheets, setSheets] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const [filters, setFilters] = useState({
startDate: '',
endDate: '',
employee: ''
});
const [filtered, setFiltered] = useState([]);
const [totalsByEmployee, setTotalsByEmployee] = useState({});

// Fetch all timesheets
const load = async () => {
setLoading(true);
try {
const { data } = await axios.get(
'http://localhost:5000/api/admin/timesheets',
{ headers: { Authorization: `Bearer ${user.token}` } }
);
setSheets(data);
setFiltered(data);
calculateTotals(data);
} catch {
setError('Failed to load timesheets');
} finally {
setLoading(false);
}
};

useEffect(() => {
load();
}, [user]);

// Calculate per-employee totals
const calculateTotals = list => {
const totals = {};
list.forEach(ts => {
const name = ts.user.name;
totals[name] = (totals[name] || 0) + ts.hoursWorked;
});
setTotalsByEmployee(totals);
};

// Handle filter inputs
const onFilterChange = e => {
setFilters({ ...filters, [e.target.name]: e.target.value });
};

// Apply filters
const applyFilters = () => {
let temp = [...sheets];
if (filters.startDate) {
temp = temp.filter(
ts => new Date(ts.startTime) >= new Date(filters.startDate)
);
}
if (filters.endDate) {
temp = temp.filter(
ts => new Date(ts.startTime) <= new Date(filters.endDate)
);
}
if (filters.employee) {
temp = temp.filter(ts =>
ts.user.name.toLowerCase().includes(filters.employee.toLowerCase())
);
}
setFiltered(temp);
calculateTotals(temp);
};

// Approve / Reject / Delete
const updateStatus = async (id, action) => {
try {
await axios.put(
`http://localhost:5000/api/admin/timesheets/${id}/${action}`,
{},
{ headers: { Authorization: `Bearer ${user.token}` } }
);
load();
} catch {
alert('Action failed');
}
};

const remove = async id => {
if (!window.confirm('Delete this timesheet?')) return;
try {
await axios.delete(
`http://localhost:5000/api/admin/timesheets/${id}`,
{ headers: { Authorization: `Bearer ${user.token}` } }
);
load();
} catch {
alert('Delete failed');
}
};

if (loading) return <Spinner animation="border" />;
if (error) return <Alert variant="danger">{error}</Alert>;

return (
<div>
{/* Header Controls */}
<div className="d-flex justify-content-between align-items-center mb-3">
<BackHomeButtons />
<button
className="btn btn-outline-danger btn-sm"
onClick={logout}
>
Logout
</button>
</div>

<h3 className="text-center">Manage Timesheets</h3>

{/* Filters */}
<Form className="my-3">
<Row className="g-2">
<Col md>
<Form.Control
type="date"
name="startDate"
value={filters.startDate}
onChange={onFilterChange}
/>
</Col>
<Col md>
<Form.Control
type="date"
name="endDate"
value={filters.endDate}
onChange={onFilterChange}
/>
</Col>
<Col md>
<Form.Control
type="text"
placeholder="Employee name"
name="employee"
value={filters.employee}
onChange={onFilterChange}
/>
</Col>
<Col xs="auto">
<Button onClick={applyFilters}>Filter</Button>
</Col>
</Row>
</Form>

{/* Totals */}
<div className="mb-4">
<h5>Total Hours by Employee:</h5>
<ul>
{Object.entries(totalsByEmployee).map(([name, hrs]) => (
<li key={name}>
<strong>{name}:</strong> {hrs.toFixed(2)} hrs
</li>
))}
</ul>
</div>

{/* Timesheet Table */}
<Table striped bordered hover>
<thead>
<tr>
<th>User</th>
<th>Date</th>
<th>Hours</th>
<th>Status</th>
<th>Actions</th>
</tr>
</thead>
<tbody>
{filtered.map(ts => (
<tr key={ts._id}>
<td>{ts.user.name}</td>
<td>{new Date(ts.startTime).toLocaleDateString('en-GB')}</td>
<td>{ts.hoursWorked.toFixed(2)}</td>
<td>{ts.status}</td>
<td>
{ts.status === 'submitted' && (
<>
<Button
size="sm"
onClick={() => updateStatus(ts._id, 'approve')}
className="me-2"
>
Approve
</Button>
<Button
size="sm"
variant="warning"
onClick={() => updateStatus(ts._id, 'reject')}
className="me-2"
>
Reject
</Button>
</>
)}
<Button
size="sm"
variant="outline-danger"
onClick={() => remove(ts._id)}
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
