import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UploadPage from './pages/UploadPage';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import DocumentDetailPage from './pages/DocumentDetailPage';
import ApprovalsPage from './pages/ApprovalsPage';
import ApprovedDocsPage from './pages/ApprovedDocsPage';
import AssignedDocsPage from './pages/AssignedDocsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import CreateUserPage from './pages/CreateUserPage';
import ManagerDashboard from './pages/ManagerDashboard';
import SplashScreen from './pages/SplashScreen';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/Admin.jsx';
// import AdminDashboard from './pages/AdminDashboard'; 



const FirstVisitGate = () => {
  const hasVisited = localStorage.getItem('hasVisited');

  return hasVisited ? <Navigate to="/login" /> : <Navigate to="/splash" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/splash" element={<SplashScreen />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/document/:id" element={<DocumentDetailPage />} />
            <Route path="/approvals" element={<ApprovalsPage />} />
            <Route path="/approved-documents" element={<ApprovedDocsPage />} />
            <Route path="/assigned-documents" element={<AssignedDocsPage />} />
            <Route path="/stats" element={<AnalyticsPage />} />
            <Route path="/create-user" element={<CreateUserPage />} />
            <Route path="/manager-dashboard" element={<ManagerDashboard />} />
            <Route path="/profile" element={<ProfilePage />} />


<Route path="/admin-dashboard" element={<AdminDashboard />} /> 
            

          </Route>
        </Route>

        <Route path="/" element={<FirstVisitGate />} />

      </Routes>
    </Router>
  );
}

export default App;