import React, { useContext, useEffect, useState } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { Card, Spinner, Alert } from 'react-bootstrap';
import BackHomeButtons from '../components/BackHomeButtons';

export default function ProfilePage() {
const { user } = useContext(AuthContext);
const [profile, setProfile] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

useEffect(() => {
const fetch = async () => {
try {
const { data } = await api.get('/api/users/me', {
headers: { Authorization: `Bearer ${user.token}` }
});
setProfile(data);
} catch {
setError('Failed to load profile');
} finally {
setLoading(false);
}
};
fetch();
}, [user]);

if (loading) return <Spinner animation="border" />;
if (error) return <Alert variant="danger">{error}</Alert>;

return (
<div>
<BackHomeButtons />
<Card className="shadow-sm mx-auto" style={{ maxWidth: '400px' }}>
<Card.Header className="bg-primary text-white">My Profile</Card.Header>
<Card.Body>
<p><b>Name:</b> {profile.name}</p>
<p><b>Email:</b> {profile.email}</p>
<p><b>Role:</b> {profile.role}</p>
</Card.Body>
</Card>
</div>
);
}