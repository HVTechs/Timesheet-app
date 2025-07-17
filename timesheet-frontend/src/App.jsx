import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';

import LoginPage from './pages/LoginPage';
import WorkerDashboard from './pages/WorkerDashboard';
import ProfilePage from './pages/ProfilePage';
import TimesheetPage from './pages/TimesheetPage';

import AdminDashboard from './admin/AdminDashboard';
import ViewUsers from './admin/ViewUsers';
import AddUser from './admin/AddUser';
import AdminTimesheetManager from './admin/AdminTimesheetManager';
import EnterTimesheetForUser from './admin/EnterTimesheetForUser';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/" replace />;
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }
  return children;
};

export default function App() {
  return (
    <>
      <Navbar />
      <div className="container-center">
        <Routes>
          <Route path="/" element={<LoginPage />} />

          {/* Worker */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={['worker', 'admin']}>
                <WorkerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute roles={['worker', 'admin']}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/timesheets"
            element={
              <ProtectedRoute roles={['worker']}>
                <TimesheetPage />
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute roles={['admin']}>
                <ViewUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/add-user"
            element={
              <ProtectedRoute roles={['admin']}>
                <AddUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/timesheets"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminTimesheetManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/enter-timesheet"
            element={
              <ProtectedRoute roles={['admin']}>
                <EnterTimesheetForUser />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <footer>Developed by Hemanth</footer>
    </>
  );
}