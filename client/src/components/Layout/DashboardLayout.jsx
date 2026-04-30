import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import { Toaster } from 'react-hot-toast';

const DashboardLayout = () => {
  const { user } = useSelector((state) => state.auth);
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 transition-all duration-300">
        <Outlet />
      </main>
      <Toaster position="top-right" toastOptions={{ className: 'dark:bg-slate-800 dark:text-white dark:border-slate-700' }} />
    </div>
  );
};

export default DashboardLayout;
