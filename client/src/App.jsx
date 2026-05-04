import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/Layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import IncidentList from './pages/IncidentList';
import IncidentDetail from './pages/IncidentDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PublicStatus from './pages/PublicStatus';
import UserManagement from './pages/UserManagement';
import IngestLogs from './pages/IngestLogs';
import Landing from './pages/Landing';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Docs from './pages/Docs';
import ForgotPassword from './pages/ForgotPassword';
import MonitorList from './pages/MonitorList';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Router>
      <ScrollToTop />
      <Toaster 
        position="top-center" 
        reverseOrder={false} 
        toastOptions={{
          duration: 3000,
        }}
      />
      <Routes>
        {/* Public Marketing Page */}
        <Route path="/" element={<Landing />} />
        
        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/status" element={<PublicStatus />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Protected Dashboard Area */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/incidents" element={<IncidentList />} />
          <Route path="/incidents/:id" element={<IncidentDetail />} />
          <Route path="/monitors" element={<MonitorList />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/ingest" element={<IngestLogs />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
