import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import {
Table,
Form,
Button,
Alert,
Spinner
} from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import BackHomeButtons from '../components/BackHomeButtons';

export default function TimesheetPage() {
const { user, logout } = useContext(AuthContext);
const [sheets, setSheets] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const [filters, setFilters] = useState({
startDate: '',
endDate: ''
});
const [filteredSheets, setFilteredSheets] = useState([]);
const [totalHrs, setTotalHrs] = useState(0);

// Fetch my sheets
const load = async () => {
setLoading(true);
try {
const { data } = await api.get(
'/api/timesheets/my',
{ headers: { Authorization: `Bearer ${user.token}` } }
);
setSheets(data);
setFilteredSheets(data);
calcTotals(data);
} catch {
setError('Failed to load timesheets');
} finally {
setLoading(false);
}
};

useEffect(() => { load(); }, [user]);

// Calculate total hours
const calcTotals = list => {
const sum = list.reduce((acc, ts) => acc + ts.hoursWorked, 0);
setTotalHrs(sum);
};

// Handle date filter change
const onFilterChange = e => {
setFilters({ ...filters, [e.target.name]: e.target.value });
};

// Apply filters
useEffect(() => {
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
setFilteredSheets(temp);
calcTotals(temp);
}, [filters, sheets]);

if (loading) return <Spinner animation="border" />;
if (error) return <Alert variant="danger">{error}</Alert>;

return (
<div>
{/* Header */}
<div className="d-flex justify-content-between align-items-center mb-3">
<BackHomeButtons />
<button
className="btn btn-outline-danger btn-sm"
onClick={logout}
>
Logout
</button>
</div>

<h2 className="text-center">My Timesheets</h2>

{/* Date Filters */}
<Form className="my-3">
<Form.Group className="mb-2">
<Form.Label>Filter by Date Range</Form.Label>
<div className="d-flex">
<Form.Control
type="date"
name="startDate"
value={filters.startDate}
onChange={onFilterChange}
/>
<span className="mx-2 align-self-center">to</span>
<Form.Control
type="date"
name="endDate"
value={filters.endDate}
onChange={onFilterChange}
/>
</div>
</Form.Group>
</Form>

{/* Total Hours */}
<p><strong>Total Hours:</strong> {totalHrs.toFixed(2)}</p>

{/* Timesheet Table */}
<Table striped bordered hover>
<thead>
<tr>
<th>Date</th>
<th>Start</th>
<th>End</th>
<th>Break</th>
<th>Hours</th>
<th>Status</th>
</tr>
</thead>
<tbody>
{filteredSheets.map(ts => (
<tr key={ts._id}>
<td>{new Date(ts.startTime).toLocaleDateString('en-AU', { timeZone: 'Australia/Sydney' })}</td>
<td>{new Date(ts.startTime).toLocaleTimeString('en-AU', { timeZone: 'Australia/Sydney' })}</td>
<td>{new Date(ts.endTime).toLocaleTimeString('en-AU', { timeZone: 'Australia/Sydney' })}</td>
<td>{ts.breakMinutes}</td>
<td>{ts.hoursWorked.toFixed(2)}</td>
<td>{ts.status}</td>
</tr>
))}
</tbody>
</Table>
</div>
);
}
