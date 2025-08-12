import React, { useState, useEffect, useContext } from "react";
import api from "../api";
import { Table, Form, Button, Alert, Spinner } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import BackHomeButtons from "../components/BackHomeButtons";

/**
* Parse ISO-ish timestamp from backend into a Date reliably across browsers.
* - Handles "2025-07-23T17:30:00.000+00:00" (removes colon in offset -> +0000)
* - Handles "2025-07-23T17:30:00.000Z"
* - Handles "2025-07-23 17:30:00" (adds T and treats as UTC)
*/
function parseIsoToDate(iso) {
if (!iso) return null;
if (iso instanceof Date) return iso;

let s = String(iso).trim();

// If already ends with Z, good.
if (s.endsWith("Z")) {
const d = new Date(s);
return isNaN(d) ? null : d;
}

// If ends with +HH:MM or -HH:MM -> convert to +HHMM (Safari-fix)
// e.g. "+05:30" -> "+0530"
const offsetColonMatch = s.match(/([+-]\d{2}):(\d{2})$/);
if (offsetColonMatch) {
s = s.replace(/([+-]\d{2}):(\d{2})$/, "$1$2");
const d = new Date(s);
if (!isNaN(d)) return d;
}

// If ends with +HHMM (no colon) -> try direct parse
const offsetNoColonMatch = s.match(/([+-]\d{4})$/);
if (offsetNoColonMatch) {
const d = new Date(s);
if (!isNaN(d)) return d;
}

// If it's in "YYYY-MM-DD HH:mm:ss" (space between date/time), convert space -> T and append Z (assume UTC)
const spaceMatch = s.match(/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}(:\d{2})?/);
if (spaceMatch) {
s = s.replace(" ", "T");
// If still no timezone info, assume UTC (append Z)
if (!/[zZ]|[+\-]\d{2}:?\d{2}$/.test(s)) s = s + "Z";
const d = new Date(s);
if (!isNaN(d)) return d;
}

// If no timezone info at all and no offset (e.g. "2025-07-23T17:30:00"), assume UTC and append Z
const noTz = !/[zZ]|[+\-]\d{2}:?\d{2}$/.test(s);
if (noTz) {
const s2 = s + "Z";
const d2 = new Date(s2);
if (!isNaN(d2)) return d2;
}

// Last attempt — try direct Date parse
const fallback = new Date(s);
if (!isNaN(fallback)) return fallback;

return null;
}

function formatTimeSydney24(isoString) {
const date = parseIsoToDate(isoString);
if (!date) return "";
try {
return date.toLocaleTimeString("en-GB", {
timeZone: "Australia/Sydney",
hour12: false,
hour: "2-digit",
minute: "2-digit",
second: undefined // omit seconds if you prefer; set '2-digit' if you want them
});
} catch (e) {
// Very unlikely in modern browsers, fallback to manual UTC->local-ish display:
const hh = date.getUTCHours().toString().padStart(2, "0");
const mm = date.getUTCMinutes().toString().padStart(2, "0");
return `${hh}:${mm}`; // fallback (UTC shown) — mostly for debugging
}
}

function formatDateSydney(isoString) {
const date = parseIsoToDate(isoString);
if (!date) return "";
try {
return date.toLocaleDateString("en-AU", {
timeZone: "Australia/Sydney",
day: "2-digit",
month: "2-digit",
year: "numeric",
});
} catch (e) {
return date.toISOString().split("T")[0];
}
}

export default function TimesheetPage() {
const { user, logout } = useContext(AuthContext);
const [sheets, setSheets] = useState([]);
const [filteredSheets, setFilteredSheets] = useState([]);
const [filters, setFilters] = useState({ startDate: "", endDate: "" });
const [totalHrs, setTotalHrs] = useState(0);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

// Fetch
useEffect(() => {
let mounted = true;
const load = async () => {
setLoading(true);
setError("");
if (!user?.token) {
setError("Not logged in");
setLoading(false);
return;
}
try {
// ensure correct endpoint; api.js should have baseURL for prod
const res = await api.get("/api/timesheets/my", {
headers: { Authorization: `Bearer ${user.token}` },
});
if (!mounted) return;
setSheets(res.data || []);
setFilteredSheets(res.data || []);
// totals:
const sum = (res.data || []).reduce((acc, ts) => acc + (ts.hoursWorked || 0), 0);
setTotalHrs(Number(sum.toFixed(2)));
} catch (err) {
console.error("Failed to load timesheets:", err);
setError(err.response?.data?.message || err.message || "Failed to load timesheets");
} finally {
if (mounted) setLoading(false);
}
};
load();
return () => { mounted = false; };
}, [user]);

// Filters
useEffect(() => {
let temp = [...sheets];
if (filters.startDate) {
const startFilter = new Date(filters.startDate);
// compare using the parsed startTime treated as Sydney date start-of-day
temp = temp.filter((ts) => {
const dt = parseIsoToDate(ts.startTime);
if (!dt) return false;
// convert to Sydney date string YYYY-MM-DD for comparison
const sydneyDate = formatDateSydney(ts.startTime).split("/").reverse().join("-"); // dd/mm/yyyy -> yyyy-mm-dd
return sydneyDate >= filters.startDate;
});
}
if (filters.endDate) {
temp = temp.filter((ts) => {
const sydneyDate = formatDateSydney(ts.startTime).split("/").reverse().join("-");
return sydneyDate <= filters.endDate;
});
}
setFilteredSheets(temp);
const sum = temp.reduce((acc, ts) => acc + (ts.hoursWorked || 0), 0);
setTotalHrs(Number(sum.toFixed(2)));
}, [filters, sheets]);

const onFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

if (loading)
return (
<div className="text-center mt-5">
<Spinner animation="border" />
</div>
);

if (error)
return (
<div className="container mt-4">
<Alert variant="danger">{error}</Alert>
<div className="mt-2">
<Button variant="secondary" onClick={() => window.location.reload()}>Retry</Button>
</div>
</div>
);

return (
<div className="container mt-3">
<div className="d-flex justify-content-between align-items-center mb-3">
<BackHomeButtons />
<Button variant="outline-danger" size="sm" onClick={logout}>Logout</Button>
</div>

<h2 className="text-center mb-3">My Timesheets</h2>

<Form className="mb-3">
<Form.Group>
<Form.Label>Filter by Date Range</Form.Label>
<div className="d-flex">
<Form.Control type="date" name="startDate" value={filters.startDate} onChange={onFilterChange} />
<span className="mx-2 align-self-center">to</span>
<Form.Control type="date" name="endDate" value={filters.endDate} onChange={onFilterChange} />
</div>
</Form.Group>
</Form>

<p><strong>Total Hours:</strong> {totalHrs.toFixed(2)}</p>

<Table striped bordered hover responsive>
<thead>
<tr>
<th>Date</th>
<th>Start</th>
<th>End</th>
<th>Break (min)</th>
<th>Hours</th>
<th>Status</th>
</tr>
</thead>
<tbody>
{filteredSheets.length === 0 ? (
<tr><td colSpan={6} className="text-center">No timesheets found.</td></tr>
) : filteredSheets.map(ts => {
const dateStr = formatDateSydney(ts.startTime);
const start = formatTimeSydney24(ts.startTime);
const end = formatTimeSydney24(ts.endTime);
// debug: you can comment out logs after testing
// console.log('RAW start:', ts.startTime, 'parsed:', parseIsoToDate(ts.startTime), 'startFormatted:', start);
return (
<tr key={ts._id}>
<td>{dateStr}</td>
<td>{start}</td>
<td>{end}</td>
<td>{ts.breakMinutes ?? 0}</td>
<td>{(ts.hoursWorked ?? 0).toFixed(2)}</td>
<td>{ts.status}</td>
</tr>
);
})}
</tbody>
</Table>
</div>
);
}
