import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import { Toaster } from 'react-hot-toast';
import useSocket from '../../hooks/useSocket';

import { useState } from 'react';
import { Menu, X as CloseIcon } from 'lucide-react';

const DashboardLayout = () => {
  useSocket();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-[#020617] relative">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden animate-in fade-in duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 border-b border-white/5 bg-[#0b1120]/80 backdrop-blur-lg z-40 flex items-center justify-between px-6">
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
        >
          <Menu size={24} />
        </button>
        <span className="text-white font-bold italic tracking-tighter">IncidentX</span>
        <div className="w-8 h-8 rounded-full bg-primary-900 flex items-center justify-center text-primary-400 font-bold text-xs">
          {user?.name?.charAt(0)}
        </div>
      </div>

      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      
      <main className="flex-1 lg:ml-64 p-4 md:p-8 pt-24 lg:pt-8 transition-all duration-300 relative z-10 w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
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
