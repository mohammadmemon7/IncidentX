import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import { Toaster } from 'react-hot-toast';
import useSocket from '../../hooks/useSocket';

const DashboardLayout = () => {
  useSocket();
  const { user } = useSelector((state) => state.auth);
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-[#020617] relative">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 transition-all duration-300 relative z-10">
        <Outlet />
      </main>
      <Toaster 
        position="top-right" 
        toastOptions={{ 
          className: 'glass border border-white/10 text-white rounded-2xl p-4 shadow-2xl',
          duration: 4000
        }} 
      />
    </div>
  );
};

export default DashboardLayout;
