import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/Layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import IncidentList from './pages/IncidentList';
import IncidentDetail from './pages/IncidentDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PublicStatus from './pages/PublicStatus';
import UserManagement from './pages/UserManagement';
import IngestLogs from './pages/IngestLogs';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/status" element={<PublicStatus />} />
        
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/incidents" element={<IncidentList />} />
          <Route path="/incidents/:id" element={<IncidentDetail />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/ingest" element={<IngestLogs />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
