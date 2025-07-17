import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function BackHomeButtons() {
const { user } = useContext(AuthContext);
const nav = useNavigate();

const goHome = () => {
if (!user) {
nav('/');
} else if (user.role === 'admin') {
nav('/admin');
} else {
nav('/dashboard');
}
};

return (
<div className="mb-3">
<button className="btn btn-link p-0 me-2" onClick={() => nav(-1)}>
← Back
</button>
<button className="btn btn-link p-0" onClick={goHome}>
Home
</button>
</div>
);
}
